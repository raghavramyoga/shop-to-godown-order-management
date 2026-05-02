const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5033/api'

export type Product = {
  id: string
  name: string
  sku: string
  category: string
  unitPrice: number
  unit: string             // displayed as "Type" in UI (pack / bottle / jar)
  weightValue: number
  weightUnit: 'g' | 'kg'
}

export type Shop = {
  id: string
  name: string
  address: string
  contact: string
  active: boolean
}

export type StockEntry = {
  productId: string
  productName: string
  sku: string
  category: string
  quantity: number
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
}

export type AllStockEntry = {
  productId: string
  productName: string
  shopId: string
  shopName: string
  quantity: number
  lastUpdated: string
}

export type OrderStatus = 'Pending' | 'Approved' | 'Dispatched' | 'Completed' | 'Cancelled'

export type OrderItem = {
  productId: string
  productName: string
  qty: number
  price: number
}

export type Order = {
  id: string
  shopId: string
  shopName: string
  shopUserId: number | null
  shopUserName: string | null
  status: OrderStatus
  createdAt: string
  total: number
  notes: string | null
  items: OrderItem[]
}

export type CreateOrderRequest = {
  shopId: string
  shopUserId?: number
  notes?: string
  items: { productId: string; qty: number }[]
}

export type AdminUser = {
  userId: number
  username: string
  fullName: string
  role: 'Admin'
}

export type ShopUserSession = {
  userId: number
  username: string
  fullName: string
  role: 'ShopUser'
  shopId: string
  shopName: string
}

export type LoginCredentials = { username: string; password: string }

export type ShopUserAccount = {
  id: number
  username: string
  fullName: string
  shopId: string
  shopName: string
  active: boolean
  createdAt: string
}

export type CreateShopUserRequest = {
  username: string
  password: string
  fullName: string
  shopId: string
}

export type UpdateShopUserRequest = {
  fullName: string
  password?: string
  shopId: string
  active: boolean
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let msg = res.statusText
    try {
      const data = await res.json()
      msg = (data as { message?: string })?.message ?? msg
    } catch { /* ignore */ }
    throw new Error(msg || `API error ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  auth: {
    adminLogin: (creds: LoginCredentials) =>
      request<AdminUser>('/auth/admin-login', { method: 'POST', body: JSON.stringify(creds) }),
    shopLogin: (creds: LoginCredentials) =>
      request<ShopUserSession>('/auth/shop-login', { method: 'POST', body: JSON.stringify(creds) }),
  },
  products: {
    list: () => request<Product[]>('/products'),
    get: (id: string) => request<Product>(`/products/${id}`),
    create: (p: Product) => request<Product>('/products', { method: 'POST', body: JSON.stringify(p) }),
    update: (id: string, p: Product) => request<void>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
    remove: (id: string) => request<void>(`/products/${id}`, { method: 'DELETE' }),
  },
  shops: {
    list: (activeOnly = false) =>
      request<Shop[]>(`/shops${activeOnly ? '?activeOnly=true' : ''}`),
    get: (id: string) => request<Shop>(`/shops/${id}`),
    create: (s: Shop) => request<Shop>('/shops', { method: 'POST', body: JSON.stringify(s) }),
    update: (id: string, s: Shop) => request<void>(`/shops/${id}`, { method: 'PUT', body: JSON.stringify(s) }),
    remove: (id: string) => request<void>(`/shops/${id}`, { method: 'DELETE' }),
  },
  shopUsers: {
    list: (shopId?: string) =>
      request<ShopUserAccount[]>(`/shop-users${shopId ? `?shopId=${shopId}` : ''}`),
    create: (u: CreateShopUserRequest) =>
      request<ShopUserAccount>('/shop-users', { method: 'POST', body: JSON.stringify(u) }),
    update: (id: number, u: UpdateShopUserRequest) =>
      request<void>(`/shop-users/${id}`, { method: 'PUT', body: JSON.stringify(u) }),
    remove: (id: number) =>
      request<void>(`/shop-users/${id}`, { method: 'DELETE' }),
  },
  stock: {
    listAll: () => request<AllStockEntry[]>('/stock'),
    byShop: (shopId: string) => request<StockEntry[]>(`/stock/shop/${shopId}`),
  },
  orders: {
    list: (params?: { shopId?: string; status?: OrderStatus; shopUserId?: number }) => {
      const q = new URLSearchParams()
      if (params?.shopId) q.set('shopId', params.shopId)
      if (params?.status) q.set('status', params.status)
      if (params?.shopUserId) q.set('shopUserId', String(params.shopUserId))
      const qs = q.toString()
      return request<Order[]>(`/orders${qs ? `?${qs}` : ''}`)
    },
    get: (id: string) => request<Order>(`/orders/${id}`),
    create: (body: CreateOrderRequest) =>
      request<Order>('/orders', { method: 'POST', body: JSON.stringify(body) }),
    updateStatus: (id: string, status: OrderStatus) =>
      request<void>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
}
