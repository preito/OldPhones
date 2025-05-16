import React, { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import * as authApi from "../../api/authApi"
import "./EditProfile.css"

export default function EditProfile() {
  const { user, loading, refreshUser } = useAuth()
  const [formData, setFormData]       = useState({ firstName: "", lastName: "", email: "" })
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword]       = useState("")
  const [error, setError]             = useState("")
  const [submitting, setSubmitting]   = useState(false)

  useEffect(() => {
    if (!loading && user) {
      setFormData({
        firstName: user.firstname,
        lastName:  user.lastname,
        email:     user.email,
      })
    }
  }, [loading, user])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(fd => ({ ...fd, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setError("")
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    if (!password) {
      setError("Password is required to confirm.")
      return
    }

    setSubmitting(true)
    try {
      await authApi.updateProfile({ ...formData, password })
      // refresh the context user so useEffect runs again
      await refreshUser()
      alert("Profile updated successfully.")
      setShowConfirm(false)
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.")
    } finally {
      setSubmitting(false)
      setPassword("")
    }
  }

  if (loading) return <div>Loading profile…</div>

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="edit-profile-input-item">
          <label>First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="edit-profile-input-item">
          <label>Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="edit-profile-input-item">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="edit-profile-button">
          Update Profile
        </button>
      </form>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Confirm Changes</h3>
            <p>Enter your current password to confirm.</p>
            <input
              type="password"
              placeholder="Current Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={submitting}
            />
            {error && <p className="error-text">{error}</p>}
            <div className="modal-actions">
              <button onClick={() => setShowConfirm(false)} disabled={submitting}>
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="confirm-button"
              >
                {submitting ? 'Saving…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
