import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post(
        "/api/auth/register",
        formData
      );

      console.log("Registration response:", response.data);

      setMessage("Registration successful! Redirecting to login...");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration failed:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
          "Registration failed."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the authentication service."
        );
      } else {
        setError("Something went wrong.");
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* =========================
          LEFT BRANDING
          ========================= */}

      <div className="login-brand">

        <div className="brand-content">

          <div className="brand-logo">
            DP
          </div>

          <h1>
            Bulk Disbursement Platform
          </h1>

          <p>
            A secure platform for managing payees,
            bulk payments and disbursement transactions.
          </p>

          <div className="brand-features">

            <div className="brand-feature">

              <span>✓</span>

              <div>
                <strong>Secure & Reliable</strong>

                <small>
                  Enterprise-grade authentication
                  and authorization
                </small>
              </div>

            </div>

            <div className="brand-feature">

              <span>✓</span>

              <div>
                <strong>Bulk Disbursements</strong>

                <small>
                  Process large volumes of payments
                  efficiently
                </small>
              </div>

            </div>

            <div className="brand-feature">

              <span>✓</span>

              <div>
                <strong>Centralized Management</strong>

                <small>
                  Manage payees and transactions
                  from one platform
                </small>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          REGISTER SECTION
          ========================= */}

      <div className="login-section">

        <div className="login-card register-card">

          <div className="login-header">

            <h2>
              Create your account
            </h2>

            <p>
              Register to access the Bulk Disbursement Platform
            </p>

          </div>


          {/* Success message */}

          {message && (
            <div className="login-success">

              <span>✓</span>

              <p>
                {message}
              </p>

            </div>
          )}


          {/* Error message */}

          {error && (
            <div className="login-error">

              <span>!</span>

              <p>
                {error}
              </p>

            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* First + Last Name */}

            <div className="name-row">

              <div className="form-group">

                <label htmlFor="firstName">
                  First name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="lastName">
                  Last name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />

              </div>

            </div>


            {/* Email */}

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

            </div>


            {/* Password */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <small className="input-hint">
                Use a strong password to protect your account.
              </small>

            </div>


            {/* Submit */}

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>


          {/* Login */}

          <div className="login-divider">
            <span>Already have an account?</span>
          </div>

          <Link
            to="/login"
            className="register-button"
          >
            Sign in
          </Link>


          <p className="security-note">
            🔒 Your account is protected by
            enterprise authentication.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;