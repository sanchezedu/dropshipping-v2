// Shopify Integration - Direct Checkout Links
// Uses Shopify permalink format

const SHOPIFY_DOMAIN = 'epicentrodigital-ec.myshopify.com';

// Helper to create handle from product name (for fallback)
function createHandle(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Get product page URL
export function getShopifyProductUrl(handleOrName) {
  const handle = handleOrName?.handle || createHandle(handleOrName?.name || handleOrName);
  return `https://${SHOPIFY_DOMAIN}/products/${handle}`;
}

// Direct checkout URL - tries variant ID first, then product handle
export function getShopifyCheckoutUrl(product, quantity = 1) {
  // First try: use variantId if available
  if (product?.variantId) {
    const cleanVariantId = product.variantId.replace('gid://shopify/ProductVariant/', '');
    return `https://${SHOPIFY_DOMAIN}/cart/${cleanVariantId}:${quantity}`;
  }
  
  // Second try: use shopifyId to extract variant
  if (product?.shopifyId) {
    return `https://${SHOPIFY_DOMAIN}/cart/${product.shopifyId}:${quantity}`;
  }
  
  // Third try: use handle
  if (product?.handle) {
    return `https://${SHOPIFY_DOMAIN}/cart/${product.handle}:${quantity}`;
  }
  
  // Last resort: use product name to create handle
  const handle = createHandle(product?.name || '');
  return `https://${SHOPIFY_DOMAIN}/cart/${handle}:${quantity}`;
}

// Redirect to Shopify checkout
export function redirectToShopifyCheckout(product, quantity = 1) {
  const url = getShopifyCheckoutUrl(product, quantity);
  if (url) {
    console.log('Redirecting to checkout:', url);
    window.location.href = url;
    return true;
  }
  return false;
}

// Placeholder functions
export async function fetchShopifyProducts(first = 50) {
  return [];
}

export async function fetchShopifyProduct(handle) {
  return null;
}
