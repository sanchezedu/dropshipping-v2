// Shopify Integration - Redirect to Product Page
// This is the most reliable method - redirect to Shopify product page

const SHOPIFY_DOMAIN = 'epicentrodigital-ec.myshopify.com';

// Helper to create handle from product name
function createHandle(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Get full Shopify product URL
export function getShopifyProductUrl(product) {
  // Try to use handle first
  if (product?.handle) {
    return `https://${SHOPIFY_DOMAIN}/products/${product.handle}`;
  }
  // Fallback to name
  const handle = createHandle(product?.name || '');
  return `https://${SHOPIFY_DOMAIN}/products/${handle}`;
}

// Redirect to Shopify product page (most reliable method)
export function redirectToShopifyCheckout(product, quantity = 1) {
  const url = getShopifyProductUrl(product);
  console.log('Redirecting to Shopify product:', url);
  window.location.href = url;
  return true;
}

// Legacy function for compatibility
export function getShopifyCheckoutUrl(product, quantity = 1) {
  return getShopifyProductUrl(product);
}

// Placeholder
export async function fetchShopifyProducts(first = 50) {
  return [];
}

export async function fetchShopifyProduct(handle) {
  return null;
}
