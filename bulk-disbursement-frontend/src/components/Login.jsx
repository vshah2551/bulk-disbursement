import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post(
        "/api/auth/login",
        formData
      );

      console.log("Login response:", response.data);

      localStorage.setItem("token", response.data.access_token);

      setIsLoggedIn(true);

      navigate("/dashboard");

    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
          "Invalid email or password."
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

      {/* Left branding section */}
      <div className="login-brand">

        <div className="brand-content">

          <div className="brand-logo">
            DP
          </div>

          <h1>Bulk Disbursement Platform</h1>

          <p>
            Securely manage bulk payments, payees and
            disbursement transactions from one platform.
          </p>

          <div className="brand-features">

            <div className="brand-feature">
              <span>✓</span>
              <div>
                <strong>Secure Payments</strong>
                <small>
                  Enterprise-grade authentication and authorization
                </small>
              </div>
            </div>

            <div className="brand-feature">
              <span>✓</span>
              <div>
                <strong>Bulk Processing</strong>
                <small>
                  Manage thousands of payments efficiently
                </small>
              </div>
            </div>

            <div className="brand-feature">
              <span>✓</span>
              <div>
                <strong>Real-time Tracking</strong>
                <small>
                  Monitor your disbursement transactions
                </small>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Login section */}
      <div className="login-section">

        <div className="login-card">

          <div className="login-header">

            <h2>Welcome back</h2>

            <p>
              Sign in to access your dashboard
            </p>

          </div>

          {error && (
            <div className="login-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

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

            <div className="form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <a href="#">
                  Forgot password?
                </a>

              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

            </div>

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                "Sign in"
              )}
            </button>

          </form>

          <div className="login-divider">
            <span>New to the platform?</span>
          </div>

          <Link
            to="/register"
            className="register-button"
          >
            Create an account
          </Link>

          <p className="security-note">
            🔒 Your connection is secured using
            enterprise authentication.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;