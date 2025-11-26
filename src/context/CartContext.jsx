import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { PRODUCTS } from '../data/products'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  // Initialize qty for all products to 0
  const [qty, setQty] = useState(() =>
    Object.fromEntries(PRODUCTS.map(p => [p.id, 0]))
  )

  const [cartOpen, setCartOpen] = useState(false)

  // Actions
  const openCart = () => setCartOpen(true)
  const closeCart = () => setCartOpen(false)
  const toggleCart = () => setCartOpen(prev => !prev)

  const inc = id => {
    setQty(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const dec = id => {
    setQty(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }))
  }

  const clearItem = id => {
    setQty(prev => ({ ...prev, [id]: 0 }))
  }

  const clearCart = () => {
    setQty(Object.fromEntries(PRODUCTS.map(p => [p.id, 0])))
  }

  // Derived State
  const subtotal = useMemo(
    () =>
      PRODUCTS.reduce(
        (sum, p) => sum + (qty[p.id] || 0) * p.price,
        0
      ),
    [qty]
  )

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0
    return 15
  }, [subtotal])

  const grand = subtotal + shipping

  const cartItems = useMemo(
    () =>
      PRODUCTS.filter(p => (qty[p.id] || 0) > 0).map(p => ({
        ...p,
        qty: qty[p.id],
        line: (qty[p.id] || 0) * p.price,
      })),
    [qty]
  )

  const cartCount = useMemo(
    () =>
      Object.values(qty).reduce(
        (total, v) => total + (v || 0),
        0
      ),
    [qty]
  )

  const value = {
    qty,
    cartOpen,
    openCart,
    closeCart,
    toggleCart,
    inc,
    dec,
    clearItem,
    clearCart,
    subtotal,
    shipping,
    grand,
    cartItems,
    cartCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
