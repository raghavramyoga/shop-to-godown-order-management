import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Product, CurrentUser } from '../types'
import { seedProducts } from '../data/seedProducts'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'
const STORAGE_KEY = 'phase1.currentUser'

const categoryPrefix = (category: string) => {
  const c = (category || 'GEN').toUpperCase()
  return c.length >= 3 ? c.slice(0, 3) : c
}

const nextProductId = (products: Product[]) => {
  let max = 0
  for (const p of products) {
    const n = parseInt(p.id.replace(/^P/i, ''), 10)
    if (!Number.isNaN(n) && n > max) max = n
  }
  return `P${String(max + 1).padStart(3, '0')}`
}

type AppContextType = {
  currentUser: CurrentUser
  login: (username: string, password: string) => boolean
  logout: () => void

  products: Product[]
  addProduct: (input: Omit<Product, 'id' | 'sku'>) => Product
  updateProduct: (id: string, input: Omit<Product, 'id' | 'sku'>) => void
  deleteProduct: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

const loadStoredUser = (): CurrentUser => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CurrentUser) : null
  } catch {
    return null
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<CurrentUser>(loadStoredUser())
  const [products, setProducts] = useState<Product[]>(seedProducts)

  const setCurrentUser = (u: CurrentUser) => {
    setCurrentUserState(u)
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else localStorage.removeItem(STORAGE_KEY)
  }

  const login = (username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setCurrentUser({ username, fullName: username })
      return true
    }
    return false
  }

  const logout = () => setCurrentUser(null)

  const addProduct = (input: Omit<Product, 'id' | 'sku'>): Product => {
    const id = nextProductId(products)
    const sku = `${categoryPrefix(input.category)}-${id.replace(/^P/i, '')}`
    const product: Product = { id, sku, ...input }
    setProducts(prev => [...prev, product])
    return product
  }

  const updateProduct = (id: string, input: Omit<Product, 'id' | 'sku'>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...input } : p))
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      products, addProduct, updateProduct, deleteProduct,
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
