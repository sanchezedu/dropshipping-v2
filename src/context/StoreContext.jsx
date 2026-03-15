import { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('dropshop-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('dropshop-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('dropshop-recent');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('dropshop-compare');
    return saved ? JSON.parse(saved) : [];
  });

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => localStorage.setItem('dropshop-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('dropshop-wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('dropshop-recent', JSON.stringify(recentlyViewed)), [recentlyViewed]);
  useEffect(() => localStorage.setItem('dropshop-compare', JSON.stringify(compareList)), [compareList]);

  // Toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name.substring(0, 30)}... agregado al carrito`);
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(item => item.id !== productId));

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) { removeFromCart(productId); return; }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => prev.find(item => item.id === product.id) ? prev.filter(item => item.id !== product.id) : [...prev, product]);
    showToast(prev.find(item => item.id === product.id) ? 'Eliminado de favoritos' : 'Agregado a favoritos');
  };

  const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  const toggleCompare = (product) => {
    setCompareList(prev => {
      if (prev.find(item => item.id === product.id)) return prev.filter(item => item.id !== product.id);
      if (prev.length >= 4) return prev;
      return [...prev, product];
    });
  };

  const isInCompare = (productId) => compareList.some(item => item.id === productId);
  const clearCompare = () => setCompareList([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      cart, wishlist, recentlyViewed, compareList, quickViewProduct, toast,
      addToCart, removeFromCart, updateQuantity, toggleWishlist, isInWishlist,
      addToRecentlyViewed, toggleCompare, isInCompare, clearCompare,
      setQuickViewProduct, showToast, cartTotal, cartCount
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
