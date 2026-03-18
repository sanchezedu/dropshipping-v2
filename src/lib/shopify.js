// Shopify Integration - Using custom domain
const SHOPIFY_DOMAIN = 'epicentrodigitalec.shop';

// Map of product names to Shopify variant IDs (we need to get these from Shopify)
// For now, we'll use product handles and let users add to cart on Shopify

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
  const handle = product?.handle || createHandle(product?.name || '');
  return `https://${SHOPIFY_DOMAIN}/products/${handle}`;
}

// Redirect to Shopify with product - goes to product page where they can add to cart
export function redirectToShopifyCheckout(product, quantity = 1) {
  const url = getShopifyProductUrl(product);
  console.log('Redirecting to Shopify:', url);
  window.location.href = url;
  return true;
}

// Legacy functions for compatibility
export function getShopifyCheckoutUrl(product, quantity = 1) {
  return getShopifyProductUrl(product);
}

export async function fetchShopifyProducts(first = 50) {
  return [];
}

export async function fetchShopifyProduct(handle) {
  return null;
}
