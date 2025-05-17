import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authApi from "../../api/authApi";
import HomeLink from '../../components/profile/HomeLink';
import "./SignUp.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = "Password must contain uppercase, lowercase, and a number";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      const { data } = await authApi.register(payload);

      
      alert(data.message); 
      navigate("/email-sent");
    } catch (err) {
      // Show the server‐side error if there is one.
      const msg =
        err.response?.data?.message || "Sign-up failed. Please try again.";
      setErrors({ submit: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    

    <div className="auth-wrapper">
        <HomeLink className="home-icon" />
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <form className="signup-input-container" onSubmit={handleSubmit}>
        <div className="signup-input-item">
          <label>First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <span className="error">{errors.firstName}</span>
          )}
        </div>

        <div className="signup-input-item">
          <label>Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <div className="signup-input-item">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="signup-input-item">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="signup-input-item">
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="signup-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/signin" className="signin-link">Sign In</Link>
      </p>
    </div>
    </div>
  );
}
