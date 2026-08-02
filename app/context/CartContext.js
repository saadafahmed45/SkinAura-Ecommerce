"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]); // NEW — store orders

  const router = useRouter();

  /* -----------------------------------
    Load Data From localStorage
  -------------------------------------*/
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    const storedOrders = localStorage.getItem("orders");

    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        // Filter out any corrupt items where price is not a valid number
        const clean = parsed.filter(
          (item) => item && typeof item.id !== "undefined" && !isNaN(Number(item.price))
        );
        setCartItems(clean);
      } catch {
        setCartItems([]);
      }
    }

    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch {
        setOrders([]);
      }
    }
  }, []);

  /* -----------------------------------
    Save to localStorage
  -------------------------------------*/
  const updateLocalStorage = (data) => {
    setCartItems(data);
    localStorage.setItem("cartItems", JSON.stringify(data));
  };

  const saveOrders = (data) => {
    setOrders(data);
    localStorage.setItem("orders", JSON.stringify(data));
  };

  /* -----------------------------------
    Add To Cart
  -------------------------------------*/
  const handleAddedCart = (item) => {
    const copy = [...cartItems];
    const index = copy.findIndex((i) => i.id === item.id);

    const price = Number(item.price) || 0;

    if (index === -1) {
      copy.push({
        ...item,
        price,
        quantity: 1,
        totalPrice: price,
      });

      updateLocalStorage(copy);

      Swal.fire({
        title: "Added to cart!",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Go to cart",
        cancelButtonText: "Continue shopping",
      }).then((res) => res.isConfirmed && router.push("/cart"));
    } else {
      Swal.fire({
        title: "Already in cart",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Go to cart",
        cancelButtonText: "Keep shopping",
      }).then((res) => res.isConfirmed && router.push("/cart"));
    }
  };

  /* -----------------------------------
    Increment / Decrement / Remove
  -------------------------------------*/
  const incrementQuantity = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Number(item.quantity) + 1,
            totalPrice: (Number(item.quantity) + 1) * Number(item.price),
          }
        : item
    );

    updateLocalStorage(updated);
  };

  const decrementQuantity = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? {
            ...item,
            quantity: Number(item.quantity) - 1,
            totalPrice: (Number(item.quantity) - 1) * Number(item.price),
          }
        : item
    );

    updateLocalStorage(updated);
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateLocalStorage(updated);
  };

  /* -----------------------------------
    Totals
  -------------------------------------*/
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const deliveryFee = cartItems.length > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  /* -----------------------------------
    PLACE ORDER SYSTEM (NEW)
  -------------------------------------*/
  const placeOrder = (customerInfo) => {
    if (cartItems.length === 0) {
      Swal.fire("Error", "Your cart is empty!", "error");
      return;
    }

    // Create order object
    const newOrder = {
      id: Date.now(),
      customer: customerInfo, // name, email, phone, address, etc.
      items: cartItems,
      subtotal,
      deliveryFee,
      total,
      date: new Date().toISOString(),
    };

    const updatedOrders = [...orders, newOrder];
    saveOrders(updatedOrders);

    // Clear cart
    updateLocalStorage([]);

    Swal.fire({
      title: "Order Placed Successfully!",
      text: "Thank you for your purchase 🎉",
      icon: "success",
      confirmButtonText: "View Order",
    }).then(() => router.push(`/my-orders`));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        handleAddedCart,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        subtotal,
        deliveryFee,
        total,
        orders,
        placeOrder, // NEW — export order function
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
