import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


const CartContext = createContext(null);


export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("jazi_cart");

      return savedCart
        ? JSON.parse(savedCart)
        : [];
    } catch (error) {
      console.error("Failed to load cart:", error);

      return [];
    }
  });


  /* =========================
     SAVE CART
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "jazi_cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);


  /* =========================
     ADD PRODUCT
  ========================= */

  function addToCart(product) {
    if (!product || !product.id) {
      return;
    }

    if (product.is_available === false) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          name_ar: product.name_ar || "",
          price: Number(product.price),
          image: product.image || null,
          quantity: 1,
        },
      ];
    });
  }


  /* =========================
     INCREASE
  ========================= */

  function increaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }


  /* =========================
     DECREASE
  ========================= */

  function decreaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }


  /* =========================
     REMOVE PRODUCT
  ========================= */

  function removeFromCart(productId) {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId
      )
    );
  }


  /* =========================
     CLEAR CART
  ========================= */

  function clearCart() {
    setCartItems([]);
  }


  /* =========================
     TOTAL QUANTITY
  ========================= */

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cartItems]);


  /* =========================
     TOTAL PRICE
  ========================= */

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price) * item.quantity,
      0
    );
  }, [cartItems]);


  const value = {
    cartItems,

    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,

    cartCount,
    cartTotal,
  };


  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}