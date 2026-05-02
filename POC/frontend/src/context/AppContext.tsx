import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, type Product, type Shop, type AdminUser, type ShopUserSession } from '../services/api'

export type CurrentUser = AdminUser | ShopUserSession | null

export type CartItem = { productId: string; qty: number }

type AppContextType = {
  currentUser: CurrentUser
  setCurrentUser: (u: CurrentUser) => void
  logout: () => void

  cart: CartItem[]
  addToCart: (productId: string, qty?: number) => void
  updateQty: (productId: string, delta: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void

  products: Product[]
  shops: Shop[]
  getProduct: (id: string) => Product | undefined
  getShop: (id: string) => Shop | undefined
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)
const STORAGE_KEY = 'inventory.currentUser'

function loadStoredUser(): CurrentUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CurrentUser) : null
  } catch {
    return null
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<CurrentUser>(loadStoredUser())
  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const setCurrentUser = (u: CurrentUser) => {
    setCurrentUserState(u)
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else localStorage.removeItem(STORAGE_KEY)
  }

  const logout = () => {
    setCurrentUser(null)
    setCart([])
  }

  const refresh = async () => {
    try {
      setLoading(true)
      setError(null)
      const [p, s] = await Promise.all([api.products.list(), api.shops.list()])
      setProducts(p)
      setShops(s)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const addToCart = (productId: string, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.productId === productId)
      if (existing) return prev.map(c => c.productId === productId ? { ...c, qty: c.qty + qty } : c)
      return [...prev, { productId, qty }]
    })
  }

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(c => c.productId === productId ? { ...c, qty: Math.max(1, c.qty + delta) } : c))
  }

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(c => c.productId !== productId))
  const clearCart = () => setCart([])

  const getProduct = (id: string) => products.find(p => p.id === id)
  const getShop = (id: string) => shops.find(s => s.id === id)

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, logout,
      cart, addToCart, updateQty, removeFromCart, clearCart,
      products, shops, getProduct, getShop,
      loading, error, refresh,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
