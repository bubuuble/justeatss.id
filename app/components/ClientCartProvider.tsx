"use client";
import { CartProvider } from "@/app/(main)/context/CartContext";

export default function ClientCartProvider({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
