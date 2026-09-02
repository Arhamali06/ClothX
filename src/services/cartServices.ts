import api from "../api/api";
import { Cart, CartsResponse, CartProduct } from "../types/cart";

/**
 * Fetch all carts from dummyjson API
 * Endpoint: https://dummyjson.com/carts
 */
export const getCarts = async (limit = 10, skip = 0): Promise<CartsResponse> => {
  const response = await api.get<CartsResponse>("/carts", {
    params: { limit, skip },
  });
  return response.data;
};

/**
 * Fetch a single cart by its ID
 * Endpoint: https://dummyjson.com/carts/:id
 */
export const getCartById = async (id: number): Promise<Cart> => {
  const response = await api.get<Cart>(`/carts/${id}`);
  return response.data;
};

/**
 * Fetch carts belonging to a specific user ID
 * Endpoint: https://dummyjson.com/carts/user/:userId
 */
export const getUserCarts = async (userId: number): Promise<CartsResponse> => {
  const response = await api.get<CartsResponse>(`/carts/user/${userId}`);
  return response.data;
};

/**
 * Convenience helper to fetch all products from the first available cart
 */
export const fetchDefaultCartProducts = async (): Promise<CartProduct[]> => {
  const data = await getCarts(1);
  if (data.carts && data.carts.length > 0) {
    return data.carts[0].products;
  }
  return [];
};

export default {
  getCarts,
  getCartById,
  getUserCarts,
  fetchDefaultCartProducts,
};
