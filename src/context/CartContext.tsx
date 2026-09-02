import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { Product } from "../types/products";
import { getCarts } from "../services/cartServices";

export interface CartItem {
  id: number;
  title: string;
  category: string;
  price: number;
  thumbnail: string;
  quantity: number;
  selectedSize?: string;
  description?: string;
  discountPercentage?: number;
  discountedTotal?: number;
}

type ProductInput =
  | Product
  | CartItem
  | {
      id: number | string;
      name?: string;
      title?: string;
      category?: string;
      price?: number | string;
      image?: { uri?: string } | any;
      thumbnail?: string;
      description?: string;
      selectedSize?: string;
    };

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  fetchCartData: () => Promise<void>;
  refreshCart: () => Promise<void>;
  addToCart: (
    product: ProductInput,
    quantity?: number,
    selectedSize?: string
  ) => void;
  updateQuantity: (productId: number | string, newQuantity: number) => void;
  removeFromCart: (productId: number | string) => void;
  clearCart: () => void;
  uniqueProductsCount: number;
  totalItemsCount: number;
  subtotal: number;
  shipping: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCartData = useCallback(async () => {
    try {
      setError(null);
      const data = await getCarts(1);
      if (data.carts && data.carts.length > 0) {
        const firstCart = data.carts[0];
        const formattedItems: CartItem[] = firstCart.products.map((item) => ({
          id: item.id,
          title: item.title,
          category: "Fashion & Lifestyle",
          price: item.price,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          selectedSize: "M",
          discountPercentage: item.discountPercentage,
          discountedTotal: item.discountedTotal,
        }));
        setCartItems(formattedItems);
      }
    } catch (err: any) {
      console.error("Failed to fetch cart from API:", err);
      setError(err?.message || "Failed to load cart items from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const data = await getCarts(1);
      if (data.carts && data.carts.length > 0) {
        const firstCart = data.carts[0];
        const formattedItems: CartItem[] = firstCart.products.map((item) => ({
          id: item.id,
          title: item.title,
          category: "Fashion & Lifestyle",
          price: item.price,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          selectedSize: "M",
          discountPercentage: item.discountPercentage,
          discountedTotal: item.discountedTotal,
        }));
        setCartItems(formattedItems);
      }
    } catch (err: any) {
      console.error("Failed to refresh cart from API:", err);
      setError(err?.message || "Failed to refresh cart items.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const normalizeProduct = (
    product: ProductInput,
    quantity = 1,
    selectedSize = "M"
  ): CartItem => {
    const numericId = Number(product.id);
    const title =
      "title" in product && product.title
        ? product.title
        : "name" in product && product.name
        ? product.name
        : "";
    const category = product.category || "";

    let numericPrice = 0;
    if (typeof product.price === "number") {
      numericPrice = product.price;
    } else if (typeof product.price === "string") {
      numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0;
    }

    let thumbnailUri = "";
    if ("thumbnail" in product && product.thumbnail) {
      thumbnailUri = product.thumbnail;
    } else if (
      "image" in product &&
      product.image &&
      typeof product.image === "object" &&
      "uri" in product.image &&
      product.image.uri
    ) {
      thumbnailUri = product.image.uri;
    }

    const size =
      selectedSize || ("selectedSize" in product ? product.selectedSize : "M");

    return {
      id: numericId,
      title,
      category,
      price: numericPrice,
      thumbnail: thumbnailUri,
      quantity,
      selectedSize: size,
      description: product.description,
    };
  };

  const addToCart = (
    product: ProductInput,
    quantity = 1,
    selectedSize = "M"
  ) => {
    const numericId = Number(product.id);
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === numericId
      );

      if (existingIndex > -1) {
        return prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem = normalizeProduct(product, quantity, selectedSize);
        return [...prevItems, newItem];
      }
    });
  };

  const updateQuantity = (productId: number | string, newQuantity: number) => {
    const numericId = Number(productId);
    const validQuantity = Math.max(1, newQuantity);

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === numericId ? { ...item, quantity: validQuantity } : item
      )
    );
  };

  const removeFromCart = (productId: number | string) => {
    const numericId = Number(productId);
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== numericId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  const shipping = useMemo(
    () => (cartItems.length > 0 ? 5 : 0),
    [cartItems.length]
  );

  const totalPrice = useMemo(
    () => (cartItems.length > 0 ? subtotal + shipping : 0),
    [subtotal, shipping, cartItems.length]
  );

  const uniqueProductsCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        isRefreshing,
        error,
        fetchCartData,
        refreshCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        uniqueProductsCount,
        totalItemsCount,
        subtotal,
        shipping,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
