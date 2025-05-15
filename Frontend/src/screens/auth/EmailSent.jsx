
import React from 'react'
import { Link } from 'react-router-dom'
import './EmailSent.css' 

export default function EmailSent() {
  return (
    <div className="email-sent-container">
      <div className="email-sent-card">
        {/* Checkmark icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="email-sent-icon"
        >
          <path
            fill="currentColor"
            d="M9 16.17l-3.59-3.59L4 14l5 5 12-12-1.41-1.42z"
          />
        </svg>
        <h2 className="email-sent-title">Email Sent!</h2>
        <p className="email-sent-message">
          We've sent a verification link to your email. <br />
          Please check your inbox and click the link to activate your account.
        </p>
        <Link to="/signin">
          <button className="email-sent-button">Back to Sign In</button>
        </Link>
      </div>
    </div>
  )
}
