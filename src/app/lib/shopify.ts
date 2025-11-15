const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function ShopifyData(query: string) {
  if (!domain || !storefrontAccessToken) {
    console.error('Missing Shopify configuration:', {
      domain: domain ? 'set' : 'MISSING',
      token: storefrontAccessToken ? 'set' : 'MISSING'
    });
    throw new Error("Shopify configuration is missing. Please check environment variables.");
  }

  const URL = `https://${domain}/api/2024-01/graphql.json`;

  const options = {
    endpoint: URL,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken!,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const data = await fetch(URL, options).then((response) => {
      return response.json();
    });

    return data;
  } catch (error) {
    throw new Error("Products not fetched");
  }
}

export async function getProduct(productId: string) {
  const query = `
    {
      product(id: "gid://shopify/Product/${productId}") {
        id
        title
        handle
        description
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
            }
          }
        }
      }
    }
  `;

  const response = await ShopifyData(query);
  return response.data.product;
}

export async function createCheckout(variantId: string, quantity: number) {
  const query = `
    mutation {
      cartCreate(input: {
        lines: [{ merchandiseId: "${variantId}", quantity: ${quantity} }]
      }) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const response = await ShopifyData(query);
  console.log('Cart creation response:', response);

  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    throw new Error(response.errors[0]?.message || 'Failed to create cart');
  }

  if (response.data?.cartCreate?.userErrors?.length > 0) {
    const error = response.data.cartCreate.userErrors[0];
    console.error('Cart user errors:', error);
    throw new Error(error.message);
  }

  if (!response.data?.cartCreate?.cart) {
    console.error('No cart in response:', response);
    throw new Error('Failed to create cart - no cart returned');
  }

  return {
    id: response.data.cartCreate.cart.id,
    webUrl: response.data.cartCreate.cart.checkoutUrl
  };
}

export async function subscribeToNewsletter(email: string) {
  const query = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          acceptsMarketing
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email: email,
      acceptsMarketing: true,
      tags: ["newsletter-subscriber", "website-signup"]
    }
  };

  const URL = `https://${domain}/api/2024-01/graphql.json`;

  const options = {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken!,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  };

  try {
    const response = await fetch(URL, options);
    const data = await response.json();

    if (data.data?.customerCreate?.customerUserErrors?.length > 0) {
      const error = data.data.customerCreate.customerUserErrors[0];
      throw new Error(error.message);
    }

    return data.data.customerCreate.customer;
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    throw error;
  }
}
