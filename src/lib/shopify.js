// Shopify Integration - Simple and Reliable
// Redirects to Shopify product page where user can buy

const SHOPIFY_DOMAIN = 'epicentro-digital-ec.myshopify.com';

// Create handle from product name
function createHandle(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Redirect to Shopify product page
export function redirectToShopifyCheckout(product, quantity = 1) {
  // Try handle first, then fallback to name
  const handle = product?.handle || createHandle(product?.name || '');
  const url = `https://${SHOPIFY_DOMAIN}/products/${handle}`;
  console.log('Redirecting to Shopify:', url);
  window.location.href = url;
  return true;
}

// Get product URL
export function getShopifyProductUrl(product) {
  const handle = product?.handle || createHandle(product?.name || '');
  return `https://${SHOPIFY_DOMAIN}/products/${handle}`;
}

// Legacy functions
export function getShopifyCheckoutUrl(product, quantity = 1) {
  return getShopifyProductUrl(product);
}

export async function fetchShopifyProducts(first = 50) {
  return [];
}

export async function fetchShopifyProduct(handle) {
  return null;
}

// Export init for compatibility
export async function initVariantCache() {
  return {};
}
