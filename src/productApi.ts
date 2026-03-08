export interface ApiProduct {
  id: string;
  image: string | null;
  productId: string;
  name: string;
  price: number;
  description: string | null;
  title: string | null;
  compareAtPrice: number | null;
  stockQuantity: number;
  active: boolean;
  brand: string | null;
  sku: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  result: {
    products: ApiProduct[];
    lastEvaluatedKey: string | null;
    totalCount: number;
  };
  success: boolean;
  successMessage: string;
  statusCode: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any[];
}

export async function getProducts(
  pageSize?: number,
  lastEvaluatedKey?: string,
): Promise<ApiResponse> {
  const params = new URLSearchParams();
  if (pageSize) params.append("PageSize", pageSize.toString());
  if (lastEvaluatedKey) params.append("LastEvaluatedKey", lastEvaluatedKey);

  const res = await fetch(
    `https://xad1egh6vb.execute-api.us-east-1.amazonaws.com/api/products?${params.toString()}`,
  );

  if (!res.ok) {
    throw new Error(`Erro ao buscar produtos: ${res.status}`);
  }

  return res.json();
}

export async function getProductById(
  productId: string,
): Promise<ApiProduct | null> {
  const response = await getProducts();

  if (!response.success || !response.result.products) {
    return null;
  }

  const product = response.result.products.find(
    (p) => p.productId === productId && !p.deleted,
  );

  return product || null;
}

export function searchProducts(
  products: ApiProduct[],
  searchTerm: string,
): ApiProduct[] {
  if (!searchTerm.trim()) {
    return products;
  }

  const term = searchTerm.toLowerCase().trim();

  const termSingular = term.endsWith("s") ? term.slice(0, -1) : term;

  return products.filter((product) => {
    const name = product.name.toLowerCase();
    const description = product.description?.toLowerCase() || "";
    const title = product.title?.toLowerCase() || "";
    const brand = product.brand?.toLowerCase() || "";
    const sku = product.sku?.toLowerCase() || "";

    const nameMatch = name.includes(term) || name.includes(termSingular);
    const descriptionMatch =
      description.includes(term) || description.includes(termSingular);
    const titleMatch = title.includes(term) || title.includes(termSingular);
    const brandMatch = brand.includes(term) || brand.includes(termSingular);
    const skuMatch = sku.includes(term) || sku.includes(termSingular);

    return (
      nameMatch || descriptionMatch || titleMatch || brandMatch || skuMatch
    );
  });
}
