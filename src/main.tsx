import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom"
import Router from './nomflix/Routes/Router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import Reset from './styles/resetCSS'
import { theme } from './nomflix/Theme/Theme'

const queryClient = new QueryClient();

const ThemedEl = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Reset />
        <RouterProvider router={Router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemedEl />
  </StrictMode>,
)
