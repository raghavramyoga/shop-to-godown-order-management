import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'

import { AppProvider } from './context/AppContext'
import { theme } from './theme'

import Layout from './components/Layout'
import Landing from './pages/Landing'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
