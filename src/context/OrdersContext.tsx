import React, { createContext, useContext, useState, useRef, ReactNode } from "react";
import { CartItem } from "./CartContext";

export interface OrderItem {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "Delivered" | "Processing" | "Shipped" | "Cancelled";
  itemsCount: number;
  totalPrice: number;
  items: OrderItem[];
}

interface OrdersContextType {
  orders: Order[];
  placeOrder: (cartItems: CartItem[], totalAmount: number) => Order;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

type OrdersProviderProps = {
  children: ReactNode;
};

const initialOrders: Order[] = [
  {
    id: "001",
    orderNumber: "001",
    date: "Aug 24, 2026",
    status: "Delivered",
    itemsCount: 2,
    totalPrice: 145.0,
    items: [
      {
        id: 1,
        title: "Essence Mascara Lash Princess",
        image: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
        price: 9.99,
        quantity: 1,
      },
      {
        id: 2,
        title: "Eyeshadow Palette with Mirror",
        image: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
        price: 19.99,
        quantity: 1,
      },
    ],
  },
];

export function OrdersProvider({ children }: OrdersProviderProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // Start counter at the number of initial orders + 1 to avoid re-renders affecting count
  const counterRef = useRef<number>(initialOrders.length + 1);

  const placeOrder = (cartItems: CartItem[], totalAmount: number): Order => {
    const orderNumber = String(counterRef.current).padStart(3, "0");
    counterRef.current += 1;

    const dateOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = new Date().toLocaleDateString("en-US", dateOptions);

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.thumbnail,
      price: item.price,
      quantity: item.quantity,
    }));

    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const newOrder: Order = {
      id: orderNumber,
      orderNumber,
      date: formattedDate,
      status: "Processing",
      itemsCount: totalCount,
      totalPrice: totalAmount,
      items: orderItems,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
