// Shopify Integration - Direct Links Method
const SHOPIFY_DOMAIN = 'kgi4yu-1z.myshopify.com';

// Redirect to Shopify product page
export function redirectToShopifyProduct(handle) {
  const url = `https://${SHOPIFY_DOMAIN}/products/${handle}`;
  console.log('Redirecting to:', url);
  window.location.href = url;
}

// Redirect to Shopify cart/checkout with variant
export function redirectToShopifyCheckout(variantId, quantity = 1) {
  if (!variantId) {
    console.error('No variant ID');
    return false;
  }
  // Use the permalink format: /cart/variant_id:quantity
  const url = `https://${SHOPIFY_DOMAIN}/cart/${variantId}:${quantity}`;
  console.log('Redirecting to checkout:', url);
  window.location.href = url;
  return true;
}

// For now, we'll use direct product links since API is failing
export function getShopifyProductUrl(handle) {
  return `https://${SHOPIFY_DOMAIN}/products/${handle}`;
}

export function getShopifyCheckoutUrl(variantId, quantity = 1) {
  if (!variantId) return null;
  return `https://${SHOPIFY_DOMAIN}/cart/${variantId}:${quantity}`;
}

// These are placeholder functions - API integration would need proper token
export async function fetchShopifyProducts(first = 50) {
  // Return empty array - we're using fallback to local/Supabase products
  // But adding product URLs for buy buttons
  console.log('Shopify API: Using fallback products (API token issue)');
  return [];
}

export async function fetchShopifyProduct(handle) {
  return null;
}
