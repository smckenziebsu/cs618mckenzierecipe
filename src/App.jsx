import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecipesPage } from './pages/RecipesPage.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: '/',
    element: <RecipesPage />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
])
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
