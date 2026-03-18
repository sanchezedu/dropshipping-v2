// Shopify Storefront API Client
// Use environment variables for security
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'epicentrodigital-ec.myshopify.com';
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

// Use latest stable API version
const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  if (!SHOPIFY_TOKEN) {
    console.error('⚠️ Shopify token not configured');
    console.log('VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN:', SHOPIFY_TOKEN ? 'Set' : 'MISSING');
    return { products: { edges: [] } };
  }

  console.log('🔄 Fetching from Shopify:', SHOPIFY_DOMAIN);
  
  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  
  if (json.errors) {
    console.error('❌ Shopify API Error:', json.errors);
    throw new Error(json.errors[0].message);
  }

  console.log('✅ Shopify API connected successfully');
  return json.data;
}

// Fetch all products
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
                  quantityAvailable
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
    
    if (!data.products) {
      return [];
    }
    
    return data.products.edges.map(({ node }) => ({
      id: parseInt(node.id.split('/').pop()),
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
      featured: node.tags.includes('featured'),
    }));
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

// Fetch single product
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
    
    if (!data.productByHandle) {
      return null;
    }
    
    const product = data.productByHandle;
    
    return {
      id: parseInt(product.id.split('/').pop()),
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

// Create checkout - accepts array of line items
export async function createCheckout(lineItems) {
  // Handle both old format (variantId, quantity) and new format (array of objects)
  let items;
  if (typeof lineItems === 'string') {
    items = [{ variantId: lineItems, quantity: 1 }];
  } else if (Array.isArray(lineItems)) {
    items = lineItems;
  } else {
    throw new Error('Invalid lineItems format');
  }

  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: items,
    },
  };

  try {
    const data = await shopifyFetch(query, variables);
    
    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
    }
    
    return data.checkoutCreate.checkout;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
}
