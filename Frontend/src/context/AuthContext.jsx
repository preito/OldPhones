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
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await authApi.me()
        setUser(data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      await authApi.login(email, password)
      const { data } = await authApi.me()
      setUser(data)
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
  }, [])

 
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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
