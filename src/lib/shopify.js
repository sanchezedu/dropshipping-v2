// Shopify Storefront API Client
const SHOPIFY_DOMAIN = 'epicentrodigital-ec.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

// Use latest API version
const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  if (!SHOPIFY_STOREFRONT_TOKEN) {
    console.error('⚠️ Shopify token not configured');
    return null;
  }

  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  
  if (json.errors) {
    console.error('❌ Shopify API Error:', json.errors);
    return null;
  }

  return json.data;
}

// Fetch all products with variants
export async function fetchShopifyProducts(first = 50) {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            vendor
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch(query, { first });
    
    if (!data?.products) {
      return [];
    }
    
    return data.products.edges.map(({ node }) => ({
      id: parseInt(node.id.split('/').pop()),
      shopifyId: node.id,
      name: node.title,
      handle: node.handle,
      description: node.description,
      category: node.productType?.toLowerCase() || 'electronica',
      price: parseFloat(node.priceRange.minVariantPrice.amount),
      originalPrice: parseFloat(node.priceRange.maxVariantPrice.amount),
      image: node.images.edges[0]?.node?.url || '',
      images: node.images.edges.map(img => img.node.url),
      vendor: node.vendor,
      tags: node.tags,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 100),
      inStock: node.variants.edges[0]?.node?.availableForSale || false,
      // IMPORTANT: Store variant ID for checkout
      variantId: node.variants.edges[0]?.node?.id || null,
      variantTitle: node.variants.edges[0]?.node?.title || 'Default',
    }));
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

// Redirect to Shopify checkout with product
export function redirectToShopifyCheckout(variantId, quantity = 1) {
  if (!variantId) {
    console.error('No variant ID provided');
    return false;
  }
  
  // Use Shopify permalink checkout
  // Format: https://store.myshopify.com/cart/variant_id:quantity
  const checkoutUrl = `https://${SHOPIFY_DOMAIN}/cart/${variantId}:${quantity}`;
  
  console.log('Redirecting to Shopify:', checkoutUrl);
  window.location.href = checkoutUrl;
  return true;
}

// Get product by handle with all variants
export async function fetchShopifyProduct(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        productType
        vendor
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              quantityAvailable
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch(query, { handle });
    
    if (!data?.productByHandle) {
      return null;
    }
    
    const product = data.productByHandle;
    
    return {
      id: parseInt(product.id.split('/').pop()),
      shopifyId: product.id,
      name: product.title,
      handle: product.handle,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      category: product.productType?.toLowerCase() || 'electronica',
      price: parseFloat(product.priceRange.minVariantPrice.amount),
      originalPrice: parseFloat(product.priceRange.maxVariantPrice.amount),
      image: product.images.edges[0]?.node?.url || '',
      images: product.images.edges.map(img => img.node.url),
      vendor: product.vendor,
      tags: product.tags,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 100),
      inStock: product.variants.edges[0]?.node?.availableForSale || false,
      variants: product.variants.edges.map(v => ({
        id: v.node.id,
        shopifyVariantId: v.node.id,
        name: v.node.title,
        price: parseFloat(v.node.price.amount),
        inStock: v.node.availableForSale,
        options: v.node.selectedOptions,
      })),
    };
  } catch (error) {
    console.error('Error fetching Shopify product:', error);
    return null;
  }
}
