import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LogoutButton({ redirectTo = '/signin', children }) {
  const { logout } = useAuth()
  const navigate    = useNavigate()

  const handleClick = async () => {
    await logout()
    if (redirectTo) navigate(redirectTo)
  }

  return (
    <button onClick={handleClick}>
      {children || 'Logout'}
    </button>
  )
}
