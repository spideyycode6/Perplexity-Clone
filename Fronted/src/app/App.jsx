import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useAuth } from '../feature/auth/hook/useAuth'
import { useEffect } from 'react'

const skipSessionPaths = ['/login', '/register']

const App = () => {
  const auth = useAuth()
  useEffect(() => {
    const path =
      window.location.pathname.replace(/\/+$/, '') || '/'
    if (skipSessionPaths.includes(path)) {
      auth.setLoading(false)
      return
    }
    auth.handleGetMe()
  }, [])
  return (
    <RouterProvider router={router} />
  )
}

export default App