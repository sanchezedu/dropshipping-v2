// Supabase is currently unavailable - using local data only
// To fix: Make sure your Supabase project is active at https://supabase.com/dashboard

// No actual Supabase calls - just return empty/null to trigger local fallback

export const supabase = null;

export async function signUp(email, password) {
  throw new Error('Supabase not available');
}

export async function signIn(email, password) {
  throw new Error('Supabase not available');
}

export async function signOut() {
  return;
}

export async function getCurrentUser() {
  return null;
}

export async function resetPassword(email) {
  throw new Error('Supabase not available');
}

export async function fetchProducts() {
  return null; // Trigger local fallback
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
  return false;
}

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
  // Simulate order creation for offline mode
  console.log('Order created (offline mode):', order);
  return { 
    id: Math.floor(Math.random() * 100000), 
    ...order,
    created_at: new Date().toISOString(),
    status: 'pendiente'
  };
}

export async function createOrderItems(items) {
  console.log('Order items created (offline mode):', items);
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
