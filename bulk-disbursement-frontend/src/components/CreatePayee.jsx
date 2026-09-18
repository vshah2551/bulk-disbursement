import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { isOperator, isAdmin } from "../utils/auth";
import "../css/CreatePayee.css";

function CreatePayee() {

  const navigate = useNavigate();

  const canCreatePayee = isOperator() || isAdmin();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    panNumber: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
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
        "/api/payees",
        formData
      );

      console.log("Create payee response:", response.data);

      setMessage("Payee created successfully.");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        panNumber: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
      });

    } catch (error) {

      console.error("Failed to create payee:", error);

      if (error.response) {

        setError(
          error.response.data?.message ||
          "Failed to create payee."
        );

      } else if (error.request) {

        setError(
          "Unable to connect to the Payee Service."
        );

      } else {

        setError("Something went wrong.");
      }

    } finally {

      setLoading(false);
    }
  }

  if (!canCreatePayee) {

    return (
      <div className="create-payee-page">

        <div className="create-payee-card">

          <h1>Access Denied</h1>

          <p>
            You do not have permission to create payees.
          </p>

          <button
            onClick={() => navigate("/payees")}
          >
            Back to Payees
          </button>

        </div>

      </div>
    );
  }

  return (

    <div className="create-payee-page">

      <div className="create-payee-card">

        <div className="create-payee-header">

          <h1>Create Payee</h1>

          <p>
            Register a new payee for the platform.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="panNumber">
              PAN Number
            </label>

            <input
              id="panNumber"
              name="panNumber"
              type="text"
              placeholder="Enter PAN number"
              value={formData.panNumber}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="accountNumber">
              Account Number
            </label>

            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="ifscCode">
                IFSC Code
              </label>

              <input
                id="ifscCode"
                name="ifscCode"
                type="text"
                placeholder="Enter IFSC code"
                value={formData.ifscCode}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="bankName">
                Bank Name
              </label>

              <input
                id="bankName"
                name="bankName"
                type="text"
                placeholder="Enter bank name"
                value={formData.bankName}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/payees")}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Payee"}
            </button>

          </div>

        </form>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

      </div>

    </div>
  );
}

export default CreatePayee;