import { createContext, useState, useEffect } from "react";
import { food_list } from "../assets/data";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [allproduct, setAllproduct] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [cart, setCart] = useState(null);
  const [offer, setOffer] = useState([]);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setEmail(parsed.email);
    }
  }, []);

  // Fetch wishlist when email changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!email) return;

      try {
        const res = await fetch(`https://online-shopping-lmg9.onrender.com/wishlist?userEmail=${email}`);
        const data = await res.json();
        setFavorite(data.length ? data[0].items : []);
      } catch (err) {
        console.log("Error fetching wishlist:", err);
      }
    };
    fetchWishlist();
  }, [email]);

  // Fetch products
  const fetchInfo = async () => {
    try {
      const response = await fetch("https://online-shopping-lmg9.onrender.com/products");
      if (response.ok) {
        const data = await response.json();
        setAllproduct(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => { fetchInfo(); }, []);

  // Fetch cart for user
  const fetchCart = async (userEmail) => {
    if (!userEmail) return;
    try {
      const res = await fetch(`https://online-shopping-lmg9.onrender.com/cart?userEmail=${userEmail}`);
      const data = await res.json();
      setCart(data.length ? data[0] : null);
    } catch (err) {
      console.log("Error fetching cart:", err);
    }
  };


  useEffect(() => { if (email) fetchCart(email); }, [email]);

  useEffect(() => {
  const getOffer = async () => {
    try {
      const res = await fetch("https://online-shopping-lmg9.onrender.com/offer");
      const data = await res.json();
      setOffer(data);
    } catch (err) {
      console.log("Error fetching offers:", err);
    }
  };
  getOffer();
}, []);
const [totalOffer, setTotalOffer] = useState(0);

useEffect(() => {
  if (!cart || !cart.items) return;

  const total = cart.items.reduce((sum, item) => {
    const productOffer = offer.find((o) => o.name === item.name);
    const discountedPrice = productOffer
      ? Math.round(item.price - item.price * (productOffer.offer / 100))
      : item.price;
    return sum + discountedPrice * item.quantity;
  }, 0);

  setTotalOffer(total);
}, [cart, offer]);
console.log(totalOffer)

const getDiscountedPrice = (product) => {
  const productOffer = offer.find((o) => o.name === product.name);
  if (!productOffer) return product.price;
  const discount = productOffer.offer;
  return Math.round(product.price - product.price * (discount / 100));
};

  // Login / Logout
  const login = (userData) => {
    setUser(userData);
    setEmail(userData.email);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setEmail(null);
    setCart(null);
    setFavorite([]);
  };

  // Add to cart
  const addToCart = async (product) => {
    if (!email) return alert("Login first!");
    const priceToUse = getDiscountedPrice(product);
    console.log(priceToUse)
    if (cart) {
      const existingItem = cart.items.find((i) => i.productId === product.id);
      const updatedItems = existingItem
        ? cart.items.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...cart.items, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];

      const updatedCart = { 
        ...cart, 
        items: updatedItems, 
        total: updatedItems.reduce((sum, i) => sum + Number(priceToUse) * i.quantity, 0) 
      };

      await fetch(`https://online-shopping-lmg9.onrender.com/cart/${cart.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCart),
      });
      setCart(updatedCart);
      alert("Added to cart")
    } else {
      const newCart = {
        userEmail: email,
        items: [{ productId: product.id, name: product.name, price: product.price, quantity: 1 }],
        total: priceToUse,
      };
      const res = await fetch("https://online-shopping-lmg9.onrender.com/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCart),
      });
      const savedCart = await res.json();
      setCart(savedCart);
      alert("Added to cart")
    }
  };

  // Increase quantity
  const increaseQuantity = async (productId) => {
    if (!cart) return;
    const updatedItems = cart.items.map((i) =>
      i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
    );
    const updatedCart = { ...cart, items: updatedItems, total: updatedItems.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0) };
    setCart(updatedCart);
    await fetch(`https://online-shopping-lmg9.onrender.com/cart/${cart.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCart),
    });
  };

  // Decrease quantity
  const decreaseQuantity = async (productId) => {
    if (!cart) return;
    const updatedItems = cart.items
      .map((i) => (i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0);
    const updatedCart = { ...cart, items: updatedItems, total: updatedItems.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0) };
    setCart(updatedCart);
    await fetch(`https://online-shopping-lmg9.onrender.com/cart/${cart.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCart),
    });
  };

  // Toggle wishlist
  const Wishlist = async (product) => {
    if (!email) return alert("Login first!");
    try {
      const res = await fetch(`https://online-shopping-lmg9.onrender.com/wishlist?userEmail=${email}`);
      const data = await res.json();
      if (data.length) {
        const wishlist = data[0];
        const exists = wishlist.items.some(i => i.productId === product.id);
        const updatedItems = exists
          ? wishlist.items.filter(i => i.productId !== product.id)
          : [...wishlist.items, { productId: product.id, name: product.name }];
        await fetch(`https://online-shopping-lmg9.onrender.com/wishlist/${wishlist.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...wishlist, items: updatedItems }),
        });
        setFavorite(updatedItems || []);
      } else {
        const newWishlist = {
          userEmail: email,
          items: [{ productId: product.id, name: product.name }],
          createdAt: new Date().toISOString(),
        };
        const res = await fetch("https://online-shopping-lmg9.onrender.com/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newWishlist),
        });
        const savedWishlist = await res.json();
        setFavorite(savedWishlist.items || []);
      }
    } catch (err) {
      console.log("Wishlist error:", err);
    }
  };

  // Search function
  const searchFunction = (query) => {
    const filtered = allproduct.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const contextValue = {
    food_list,
    allproduct,
    filteredData,
    favorite,
    user,
    email,
    cart,
    login,
    logout,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    Wishlist,
    searchFunction,
    fetchCart,
    totalOffer,
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
