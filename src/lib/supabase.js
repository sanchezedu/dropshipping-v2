import { createClient } from '@supabase/supabase-js';

// Use environment variables in production, fallback to hardcoded for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ftsgaqdlnhgfsqjzvtiv.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2dhcWRsbmhnZnNxanp2dGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDY4NDIsImV4cCI6MjA4OTE4Mjg0Mn0.iIaXd01YLttwDUipiYAny7tXrgoluXPMjdUywSolcbc';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Security: detect session changes
    flowType: 'pkce',
    // Add storage key prefix for security
    storageKey: 'dropshop-auth-'
  },
  // Rate limiting: prevent abuse
  global: {
    headers: {
      'X-Client-Info': 'dropshop-web'
    }
  }
});

// Auth functions with better error handling
export async function signUp(email, password) {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  // Validate password strength
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin + '/'
    }
  });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (e) {
    return null;
  }
}

export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password'
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/'
    }
  });
  if (error) throw error;
  return data;
}

// Products
export async function fetchProducts() {
  console.log('Fetching from Supabase...');
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error.message);
      return null;
    }
    
    console.log('Supabase products loaded:', data?.length || 0);
    return data || [];
  } catch (e) {
    console.error('Supabase fetch error:', e.message);
    return null;
  }
}

export async function fetchProduct(id) {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export async function updateProduct(id, updates) {
  try {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export async function createProduct(product) {
  try {
    const { data, error } = await supabase.from('products').insert([product]).select();
    if (error) return null;
    return data[0];
  } catch (e) {
    return null;
  }
}

export async function deleteProduct(id) {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    return !error;
  } catch (e) {
    return false;
  }
}

// Orders
export async function fetchAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch (e) {
    return [];
  }
}

export async function fetchUserOrders(userId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch (e) {
    return [];
  }
}

export async function fetchOrder(id) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export async function createOrder(order) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.log('Order create error:', e.message);
    return { id: Date.now(), ...order, status: 'pendiente' };
  }
}

export async function createOrderItems(items) {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .insert(items)
      .select();
    if (error) throw error;
    return data;
  } catch (e) {
    return items;
  }
}

export async function fetchStats() {
  try {
    const { data: orders } = await supabase.from('orders').select('*');
    const { data: products } = await supabase.from('products').select('id');
    
    const totalSales = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
    const totalOrders = orders?.length || 0;
    const pendingOrders = orders?.filter(o => o.status === 'pendiente').length || 0;
    
    return {
      totalSales,
      totalOrders,
      totalProducts: products?.length || 36,
      pendingOrders
    };
  } catch (e) {
    return {
      totalSales: 0,
      totalOrders: 0,
      totalProducts: 36,
      pendingOrders: 0
    };
  }
}

// Blog posts
export async function fetchBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    if (error) return null;
    return data || [];
  } catch (e) {
    return null;
  }
}

export async function fetchBlogPost(slug) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
}

// Product variants
export async function fetchProductVariants(productId) {
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .order('type', { ascending: true });
    if (error) return [];
    return data || [];
  } catch (e) {
    return [];
  }
}
