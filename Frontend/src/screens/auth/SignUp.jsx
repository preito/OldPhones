import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css";
// import axios from "axios";

const SignUp = () => {
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

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        // Make API call to create Account

        try {
          // const response = await axios.post("/api/send-verification-email", {
          //   email,
          // });

          console.log("Email sent successfully!", response.data);
        } catch (error) {
          console.error("Failed to send email:", error);
        }

        // TODO: Do not forget to Hash the passwords upon account creation.

        console.log("Form submitted:", formData);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert("Verification email has been sent! Please check your inbox.");
      } catch (error) {
        console.error("Error:", error);
        setErrors({ submit: "Failed to create account. Please try again." });
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create Account</h2>
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <form onSubmit={handleSubmit} className="signup-input-container">
        <div className="signup-input-item">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
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
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <div className="signup-input-item">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="signup-input-item">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="signup-input-item">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
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

      <p className="signin-link">
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
