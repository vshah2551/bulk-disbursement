import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "../css/CreateScheme.css";

function CreateScheme() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    schemeCode: "",
    schemeName: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  }

  async function handleSubmit(e) {

    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {

      await apiClient.post(
        "/api/schemes",
        formData
      );

      setMessage(
        "Scheme created successfully."
      );

      setFormData({
        schemeCode: "",
        schemeName: "",
        description: ""
      });

    } catch (error) {

      console.error(
        "Failed to create scheme:",
        error
      );

      if (error.response) {

        setError(
          error.response.data?.message ||
          "Unable to create scheme."
        );

      } else if (error.request) {

        setError(
          "Unable to connect to the Scheme Service."
        );

      } else {

        setError(
          "Something went wrong."
        );
      }

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="create-scheme-page">

      <div className="create-scheme-header">

        <div>
          <h1>Create Scheme</h1>

          <p>
            Register a new disbursement scheme.
          </p>
        </div>

        <button
          className="scheme-back-button"
          onClick={() => navigate("/schemes")}
        >
          Back
        </button>

      </div>

      <div className="create-scheme-card">

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Scheme Code
            </label>

            <input
              type="text"
              name="schemeCode"
              value={formData.schemeCode}
              onChange={handleChange}
              placeholder="Example: PMKISAN2026"
              required
              minLength={3}
              maxLength={50}
            />

            <small>
              3-50 characters
            </small>

          </div>

          <div className="form-group">

            <label>
              Scheme Name
            </label>

            <input
              type="text"
              name="schemeName"
              value={formData.schemeName}
              onChange={handleChange}
              placeholder="Example: PM Kisan Samman Nidhi"
              required
              minLength={3}
              maxLength={100}
            />

            <small>
              3-100 characters
            </small>

          </div>

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter scheme description"
              rows="5"
              required
              minLength={5}
              maxLength={500}
            />

            <small>
              5-500 characters
            </small>

          </div>

          {message && (
            <div className="scheme-success">
              {message}
            </div>
          )}

          {error && (
            <div className="scheme-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="create-scheme-button"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Scheme"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateScheme;