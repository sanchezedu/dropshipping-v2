import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://market01.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcmtldDAxIiwicm9sZSI6ImFub24iLCJpbnNlcnZjb25zdW1lckNvZGUiOiJKUzBZT05ZdVR5TnhNZVItNDQ0bzZCQTRBZmpEZFciLCJpYXQiOjE3MDk0MTc0MDAsImV4cCI6MjAyNDk5MzQwMH0.N5s2zT7ZlZ8MZ9JW6lqj6YxNpZlZzQz1rYvE9y0z9k8';

// Lazy client creation to prevent initialization errors
let supabaseClient = null;

function getClient() {
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (e) {
      console.error('Supabase init error:', e);
      return null;
    }
  }
  return supabaseClient;
}

// Auth functions
export async function signUp(email, password) {
  const client = getClient();
  if (!client) throw new Error('Supabase not available');
  const { data, error } = await client.auth.signUp({
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
  const client = getClient();
  if (!client) throw new Error('Supabase not available');
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = getClient();
  if (!client) return;
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  try {
    const client = getClient();
    if (!client) return null;
    const { data: { user } } = await client.auth.getUser();
    return user;
  } catch (e) {
    return null;
  }
}

export async function resetPassword(email) {
  const client = getClient();
  if (!client) throw new Error('Supabase not available');
  const { data, error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://dropshipping-v2.vercel.app/reset-password'
  });
  if (error) throw error;
  return data;
}

// Products - always returns local fallback
export async function fetchProducts() {
  return []; // Return empty to trigger local fallback
}

export async function fetchProduct(id) {
  return null;
}

export async function updateProduct(id, updates) {
  return null;
}

export async function createProduct(product) {
  return null;
}

export async function deleteProduct(id) {
  return;
}

// Orders
export async function fetchAllOrders() {
  return [];
}

export async function fetchUserOrders(userId) {
  return [];
}

export async function fetchOrder(id) {
  return null;
}

export async function updateOrderStatus(id, status) {
  return null;
}

export async function createOrder(order) {
  // Simulate order creation
  console.log('Order created:', order);
  return { id: Date.now(), ...order };
}

export async function createOrderItems(items) {
  console.log('Order items created:', items);
  return items;
}

export async function fetchStats() {
  return {
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 16,
    pendingOrders: 0
  };
}
