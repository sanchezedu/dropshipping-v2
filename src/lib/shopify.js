// Shopify Integration - Direct Checkout with Variant IDs
// Uses permalink format: /cart/{variant_id}:{quantity}
// DOMAIN: kgi4yu-1z.myshopify.com (the working Shopify store)

const SHOPIFY_DOMAIN = 'kgi4yu-1z.myshopify.com';
const API_URL = 'https://kgi4yu-1z.myshopify.com/api/2024-10/graphql.json';
const STOREFRONT_TOKEN = 'b84e4f6f0f71ee4670602b2030fd04be';

// Fetch products with variant IDs from Shopify
export async function fetchShopifyProductsWithVariants() {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables: { first: 50 } }),
    });

    const json = await response.json();
    
    if (json.errors) {
      console.error('Shopify API Error:', json.errors);
      return [];
    }

    // Create a map of handle -> variantId
    const variantMap = {};
    if (json.data?.products?.edges) {
      json.data.products.edges.forEach(({ node }) => {
        const variantId = node.variants?.edges[0]?.node?.id;
        if (variantId && node.handle) {
          // Extract just the numeric ID
          const numericId = variantId.replace('gid://shopify/ProductVariant/', '');
          variantMap[node.handle] = numericId;
        }
      });
    }
    
    return variantMap;
  } catch (error) {
    console.error('Error fetching Shopify variants:', error);
    return {};
  }
}

// Cache for variant IDs
let variantCache = null;

// Get variant ID for a product
export function getVariantId(product) {
  if (!variantCache) return null;
  
  const handle = product?.handle || createHandle(product?.name || '');
  return variantCache[handle] || null;
}

// Initialize variant cache
export async function initVariantCache() {
  if (!variantCache) {
    variantCache = await fetchShopifyProductsWithVariants();
    console.log('Shopify variant cache loaded:', Object.keys(variantCache).length, 'products');
  }
  return variantCache;
}

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

// Redirect to Shopify cart with product pre-added
export function redirectToShopifyCheckout(product, quantity = 1) {
  // First ensure we have the variant cache
  if (!variantCache) {
    // If no cache, fallback to product page
    const handle = product?.handle || createHandle(product?.name || '');
    const url = `https://${SHOPIFY_DOMAIN}/products/${handle}`;
    console.log('No variant cache, redirecting to product page:', url);
    window.location.href = url;
    return true;
  }

  // Try to get variant ID
  const handle = product?.handle || createHandle(product?.name || '');
  const variantId = variantCache[handle];

  if (variantId) {
    // Use permalink format - goes directly to cart with product
    const url = `https://${SHOPIFY_DOMAIN}/cart/${variantId}:${quantity}`;
    console.log('Redirecting to cart:', url);
    window.location.href = url;
  } else {
    // Fallback to product page
    const url = `https://${SHOPIFY_DOMAIN}/products/${handle}`;
    console.log('No variant found, redirecting to product:', url);
    window.location.href = url;
  }
  return true;
}

export function getShopifyProductUrl(product) {
  const handle = product?.handle || createHandle(product?.name || '');
  return `https://${SHOPIFY_DOMAIN}/products/${handle}`;
}

export async function fetchShopifyProducts(first = 50) {
  return [];
}

export async function fetchShopifyProduct(handle) {
  return null;
}
