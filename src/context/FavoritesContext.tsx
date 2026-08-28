import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types/products";

export interface FavoriteItem {
  id: number;
  title: string;
  category: string;
  price: number;
  thumbnail: string;
  description?: string;
  rating?: number;
  stock?: number;
  images?: string[];
}

type ProductInput =
  | Product
  | FavoriteItem
  | {
      id: number | string;
      name?: string;
      title?: string;
      category?: string;
      price?: number | string;
      image?: { uri?: string } | any;
      thumbnail?: string;
      description?: string;
      rating?: number;
      stock?: number;
      images?: string[];
    };

interface FavoritesContextType {
  favorites: FavoriteItem[];
  favoriteIds: number[];
  isFavorite: (productId: number | string) => boolean;
  toggleFavorite: (product: ProductInput) => void;
  removeFavorite: (productId: number | string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

type FavoritesProviderProps = {
  children: ReactNode;
};

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const isFavorite = (productId: number | string): boolean => {
    const numericId = Number(productId);
    return favorites.some((item) => item.id === numericId);
  };

  const normalizeProduct = (product: ProductInput): FavoriteItem => {
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

    return {
      id: numericId,
      title,
      category,
      price: numericPrice,
      thumbnail: thumbnailUri,
      description: product.description,
      rating: product.rating,
      stock: product.stock,
      images: product.images,
    };
  };

  const toggleFavorite = (product: ProductInput) => {
    const numericId = Number(product.id);
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some((item) => item.id === numericId);
      if (exists) {
        return prevFavorites.filter((item) => item.id !== numericId);
      } else {
        return [...prevFavorites, normalizeProduct(product)];
      }
    });
  };

  const removeFavorite = (productId: number | string) => {
    const numericId = Number(productId);
    setFavorites((prevFavorites) =>
      prevFavorites.filter((item) => item.id !== numericId)
    );
  };

  const favoriteIds = favorites.map((item) => item.id);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
