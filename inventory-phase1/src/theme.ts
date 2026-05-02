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
    background: { default: 'rgba(255, 248, 225, 0)', paper: 'rgba(255, 255, 255, 0.88)' },
    text: { primary: '#3E2723', secondary: '#6D4C41' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 16px 40px -10px rgba(30, 41, 59, 0.18)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'transparent',
          backdropFilter: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3E2723',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#3E2723',
          },
        },
      },
    },
  },
})
