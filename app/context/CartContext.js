"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../lib/api";

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

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  /* -----------------------------------
    Totals
  -------------------------------------*/
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const deliveryFee = cartItems.length > 0 ? 5 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  /* -----------------------------------
    APPLY COUPON
  -------------------------------------*/
  const applyPromoCode = async (code) => {
    try {
      const res = await api.post("/coupons/apply", { code, subtotal });
      if (res.data?.success) {
        setAppliedCoupon(res.data.coupon);
        setDiscount(res.data.discount);
        Swal.fire("Promo Applied!", res.data.message, "success");
        return true;
      }
    } catch (err) {
      Swal.fire("Coupon Error", err.customMessage || "Invalid coupon code.", "error");
      return false;
    }
  };

  /* -----------------------------------
    PLACE ORDER SYSTEM
  -------------------------------------*/
  const placeOrder = async (customerInfo) => {
    if (cartItems.length === 0) {
      Swal.fire("Error", "Your cart is empty!", "error");
      return;
    }

    try {
      Swal.fire({
        title: "Processing Order...",
        text: "Securing your skincare ritual",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await api.post("/orders", {
        customer: customerInfo,
        items: cartItems.map((item) => ({
          id: item.id,
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        couponCode: appliedCoupon?.code || "",
      });

      if (res.data?.success) {
        const newOrder = res.data.order;
        const updatedOrders = [newOrder, ...orders];
        saveOrders(updatedOrders);

        // Clear cart
        updateLocalStorage([]);
        setAppliedCoupon(null);
        setDiscount(0);

        Swal.fire({
          title: "Order Placed Successfully!",
          text: `Order #${newOrder.orderNumber || newOrder.id} has been confirmed. Thank you for your purchase 🎉`,
          icon: "success",
          confirmButtonText: "View Order",
        }).then(() => router.push(`/my-orders`));
      }
    } catch (err) {
      Swal.fire({
        title: "Checkout Error",
        text: err.customMessage || "Could not process order. Please try again.",
        icon: "error",
      });
    }
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
        discount,
        total,
        orders,
        placeOrder,
        applyPromoCode,
        appliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
