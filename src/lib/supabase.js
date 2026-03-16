import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ftsgaqdlnhgfsqjzvtiv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2dhcWRsbmhnZnNxanp2dGl2Iiwicm9sZSI6ImFub24iLCJpbnNlcnZjb25zdW1lckNvZGUiOiJKUzBZT05ZdVR5TnhNZVItNDQ0bzZCQTRBZmpEZFciLCJpYXQiOjE3MDk0MTc0MDAsImV4cCI6MjAyNDk5MzQwMH0.N5s2zT7ZlZ8MZ9JW6lqj6YxNpZlZzQz1rYvE9y0z9k8';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Auth functions
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://dropshipping-v2.vercel.app/'
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
    redirectTo: 'https://dropshipping-v2.vercel.app/reset-password'
  });
  if (error) throw error;
  return data;
}

// Products
export async function fetchProducts() {
  try {
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (error) {
      console.log('Supabase error:', error.message);
      return null;
    }
    return data || [];
  } catch (e) {
    console.log('Supabase fetch error:', e.message);
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
