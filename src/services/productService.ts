import api from "../api/api";
import { Product } from "../types/products";

export const getProducts = async (
  searchQuery = ""
): Promise<Product[]> => {
  const response = await api.get(
    searchQuery ? "/products/search" : "/products/",
    {
      params: searchQuery ? { q: searchQuery } : undefined,
    }
  );

  return response.data.products;
};
