import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import * as authApi from '../api/authApi'
import axios from 'axios'

axios.defaults.withCredentials = true

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // refresh the current user
  const refreshUser = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await authApi.me()
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // on mount, fetch the user
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      await authApi.login(email, password)
      await refreshUser()
      return { success: true }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Invalid credentials'
          : 'Server error')
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [refreshUser])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch (err) {
      console.error('Logout failed', err)
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
