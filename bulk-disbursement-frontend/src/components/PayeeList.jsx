import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "../css/PayeeList.css";

function PayeeList() {
  const navigate = useNavigate();

  const [payees, setPayees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPayees() {
      try {
        const response = await apiClient.get("/api/payees");

        console.log("Payees response:", response.data);

        setPayees(response.data);
      } catch (error) {
        console.error("Failed to fetch payees:", error);

        if (error.response) {
          setError(
            error.response.data?.message ||
              "Unable to fetch payees."
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

    loadPayees();
  }, []);

  function maskAccountNumber(accountNumber) {
    if (!accountNumber) {
      return "-";
    }

    if (accountNumber.length <= 4) {
      return accountNumber;
    }

    return "••••••" + accountNumber.slice(-4);
  }

  function maskPanNumber(panNumber) {
    if (!panNumber) {
      return "-";
    }

    if (panNumber.length <= 4) {
      return panNumber;
    }

    return "•••••" + panNumber.slice(-5);
  }

  function getStatusClass(status) {
    return status?.toLowerCase() === "active"
      ? "active"
      : "inactive";
  }

  return (
    <div className="payee-list-page">

      {/* Header */}
      <div className="payee-list-header">

        <div>
          <h1>Payees</h1>

          <p>
            Manage and view registered payees.
          </p>
        </div>

        <div className="payee-header-actions">

          <button
            className="secondary-button"
            onClick={() => navigate("/payees")}
          >
            Back
          </button>

          <button
            className="primary-button"
            onClick={() => navigate("/payees/create")}
          >
            + Add Payee
          </button>

        </div>

      </div>

      {/* Summary */}
      {!loading && !error && (
        <div className="payee-summary">

          <div className="summary-card">

            <div className="summary-label">
              Total Payees
            </div>

            <div className="summary-value">
              {payees.length}
            </div>

          </div>

          <div className="summary-card">

            <div className="summary-label">
              Active Payees
            </div>

            <div className="summary-value">
              {
                payees.filter(
                  (payee) =>
                    payee.status?.toLowerCase() === "active"
                ).length
              }
            </div>

          </div>

          <div className="summary-card">

            <div className="summary-label">
              Inactive Payees
            </div>

            <div className="summary-value">
              {
                payees.filter(
                  (payee) =>
                    payee.status?.toLowerCase() !== "active"
                ).length
              }
            </div>

          </div>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="payee-list-message">
          <div className="loader"></div>
          <p>Loading payees...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="payee-list-error">

          <strong>Unable to load payees</strong>

          <p>{error}</p>

          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>

        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        payees.length === 0 && (

          <div className="payee-empty-state">

            <div className="empty-icon">
              👤
            </div>

            <h3>No payees found</h3>

            <p>
              You haven't registered any payees yet.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/payees/create")}
            >
              + Add Your First Payee
            </button>

          </div>
        )}

      {/* Table */}
      {!loading &&
        !error &&
        payees.length > 0 && (

          <div className="payee-table-card">

            <div className="table-header">

              <div>
                <h2>Registered Payees</h2>

                <p>
                  {payees.length} payee
                  {payees.length !== 1 ? "s" : ""} registered
                </p>
              </div>

            </div>

            <div className="payee-table-container">

              <table className="payee-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>PAN</th>
                    <th>Account Number</th>
                    <th>IFSC</th>
                    <th>Bank</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {payees.map((payee) => (

                    <tr key={payee.id}>

                      <td>
                        <div className="payee-name">

                          <div className="payee-avatar">
                            {payee.firstName
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {payee.firstName}{" "}
                              {payee.lastName}
                            </strong>
                          </div>

                        </div>
                      </td>

                      <td>
                        {payee.email}
                      </td>

                      <td className="masked-value">
                        {maskPanNumber(
                          payee.panNumber
                        )}
                      </td>

                      <td className="masked-value">
                        {maskAccountNumber(
                          payee.accountNumber
                        )}
                      </td>

                      <td>
                        <span className="ifsc-code">
                          {payee.ifscCode}
                        </span>
                      </td>

                      <td>
                        {payee.bankName}
                      </td>

                      <td>

                        <span
                          className={`status-badge ${getStatusClass(
                            payee.status
                          )}`}
                        >
                          <span className="status-dot"></span>

                          {payee.status}
                        </span>

                      </td>

                      <td>

                        <button
                          className="view-button"
                          onClick={() =>
                            navigate(
                              `/payees/${payee.id}`
                            )
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

    </div>
  );
}

export default PayeeList;