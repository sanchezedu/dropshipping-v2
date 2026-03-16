import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://market01.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcmtldDAxIiwicm9sZSI6ImFub24iLCJpbnNlcnZjb25zdW1lckNvZGUiOiJKUzBZT05ZdVR5TnhNZVItNDQ0bzZCQTRBZmpEZFciLCJpYXQiOjE3MDk0MTc0MDAsImV4cCI6MjAyNDk5MzQwMH0.N5s2zT7ZlZ8MZ9JW6lqj6YxNpZlZzQz1rYvE9y0z9k8';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
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
  const { data, error } = await supabase.from('products').select('*').order('id');
  if (error) throw error;
  return data || [];
}

export async function fetchProduct(id) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
  if (error) throw error;
  return data;
}

export async function createProduct(product) {
  const { data, error } = await supabase.from('products').insert([product]).select();
  if (error) throw error;
  return data[0];
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// Orders
export async function fetchAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchUserOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('customer_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchOrder(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

// Create order
export async function createOrder(order) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Create order items
export async function createOrderItems(items) {
  const { data, error } = await supabase
    .from('order_items')
    .insert(items)
    .select();
  if (error) throw error;
  return data;
}

// Stats
export async function fetchStats() {
  const { data: orders } = await supabase.from('orders').select('*');
  const { data: products } = await supabase.from('products').select('id');
  
  const totalSales = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pendiente').length || 0;
  
  return {
    totalSales,
    totalOrders,
    totalProducts: products?.length || 0,
    pendingOrders
  };
}
