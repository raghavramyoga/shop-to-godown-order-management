import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#FFD54F', light: '#FFE082', dark: '#FFC107', contrastText: '#3E2723' },
    secondary: { main: '#6D4C41', light: '#8D6E63', dark: '#4E342E', contrastText: '#FFF8E1' },
    error: { main: '#C62828' },
    warning: { main: '#FFA000' },
    success: { main: '#2E7D32' },
    info: { main: '#0277BD' },
    background: { default: '#FFF8E1', paper: '#FFFFFF' },
    text: { primary: '#3E2723', secondary: '#6D4C41' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
})
