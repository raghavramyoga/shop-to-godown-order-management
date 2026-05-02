import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { AppProvider } from './context/AppContext'
import { theme } from './theme'

import Layout from './components/Layout'
import ShopLayout from './components/ShopLayout'

import Landing from './pages/Landing'
import AdminLogin from './pages/AdminLogin'
import ShopLogin from './pages/ShopLogin'

import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Shops from './pages/Shops'
import ShopUsers from './pages/ShopUsers'
import Stock from './pages/Stock'
import Orders from './pages/Orders'
import NewOrder from './pages/NewOrder'
import RequestDetailAdmin from './pages/RequestDetailAdmin'

import ShopDashboard from './pages/shop/ShopDashboard'
import RequestStock from './pages/shop/RequestStock'
import Cart from './pages/shop/Cart'
import MyRequests from './pages/shop/MyRequests'
import RequestDetail from './pages/shop/RequestDetail'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <AppProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Login pages */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/shop/login" element={<ShopLogin />} />

          {/* Shop user flow */}
          <Route path="/shop" element={<ShopLayout />}>
            <Route index element={<ShopDashboard />} />
            <Route path="request" element={<RequestStock />} />
            <Route path="cart" element={<Cart />} />
            <Route path="requests" element={<MyRequests />} />
            <Route path="requests/:id" element={<RequestDetail />} />
          </Route>

          {/* Admin flow */}
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="shops" element={<Shops />} />
            <Route path="shop-users" element={<ShopUsers />} />
            <Route path="stock" element={<Stock />} />
            <Route path="requests" element={<Orders />} />
            <Route path="requests/new" element={<NewOrder />} />
            <Route path="requests/:id" element={<RequestDetailAdmin />} />
          </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
