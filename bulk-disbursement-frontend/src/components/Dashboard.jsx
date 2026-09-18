import { useNavigate } from "react-router-dom";
import "../css/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  function getUserRole() {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      const roles = payload.realm_access?.roles || [];
        console.log("User roles:", roles);
      if (roles.includes("DISBURSEMENT_OPERATOR")) {
        return "DISBURSEMENT_OPERATOR";
      }

      if (roles.includes("DISBURSEMENT_APPROVER")) {
        return "DISBURSEMENT_APPROVER";
      }

      if (roles.includes("ADMIN")) {
        return "ADMIN";
      }

      return null;

    } catch (error) {
      console.error("Unable to read JWT:", error);
      return null;
    }
  }

  const role = getUserRole();

  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="dashboard-header">

        <div>
          <h1>Bulk Disbursement Platform</h1>

          <p>
            Manage payees, schemes and disbursement transactions.
          </p>
        </div>

        <div className="header-status">
          <span className="online-dot"></span>
          System Operational
        </div>

      </div>

      {/* Summary Cards */}
      <div className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-icon blue">
            ₹
          </div>

          <div>
            <span>Total Disbursed</span>
            <strong>₹0.00</strong>
            <small>This month</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            ✓
          </div>

          <div>
            <span>Successful</span>
            <strong>0</strong>
            <small>This month</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            ⏳
          </div>

          <div>
            <span>Pending</span>
            <strong>0</strong>
            <small>Awaiting processing</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            !
          </div>

          <div>
            <span>Failed</span>
            <strong>0</strong>
            <small>This month</small>
          </div>
        </div>

      </div>

      {/* Platform Services */}
      <div className="section-header">

        <div>
          <h2>Platform Services</h2>

          <p>
            Access the features available to you.
          </p>
        </div>

      </div>

      <div className="service-grid">

        {/* OPERATOR */}
        {role === "DISBURSEMENT_OPERATOR" && (
          <>
            <div
              className="service-card clickable"
              onClick={() => navigate("/payees")}
            >

              <div className="service-icon purple">
                👥
              </div>

              <div className="service-content">

                <h3>Payees</h3>

                <p>
                  Register and manage your payees.
                </p>

                <button className="service-button">
                  Manage Payees
                  <span>→</span>
                </button>

              </div>

            </div>

            <div
              className="service-card clickable"
              onClick={() => navigate("/schemes")}
            >

              <div className="service-icon blue">
                ◈
              </div>

              <div className="service-content">

                <h3>Schemes</h3>

                <p>
                  Create and manage your disbursement schemes.
                </p>

                <button className="service-button">
                  Manage Schemes
                  <span>→</span>
                </button>

              </div>

            </div>

            <div
              className="service-card clickable"
              onClick={() => navigate("/disbursements")}
            >

              <div className="service-icon green">
                ⇄
              </div>

              <div className="service-content">

                <h3>Disbursements</h3>

                <p>
                  Create and submit bulk disbursement requests.
                </p>

                <button className="service-button">
                  Manage Disbursements
                  <span>→</span>
                </button>

              </div>

            </div>
          </>
        )}

        {/* APPROVER */}
        {role === "DISBURSEMENT_APPROVER" && (
          <div
            className="service-card clickable"
            onClick={() => navigate("/disbursements/approval")}
          >

            <div className="service-icon orange">
              ✓
            </div>

            <div className="service-content">

              <h3>Disbursement Approval</h3>

              <p>
                Review, approve or reject submitted disbursements.
              </p>

              <button className="service-button">
                Review Disbursements
                <span>→</span>
              </button>

            </div>

          </div>
        )}

        {/* ADMIN */}
        {role === "ADMIN" && (
          <>
            <div
              className="service-card clickable"
              onClick={() => navigate("/disbursements/approved")}
            >

              <div className="service-icon blue">
                ✓
              </div>

              <div className="service-content">

                <h3>Approved Disbursements</h3>

                <p>
                  Review approved requests and send them for processing.
                </p>

                <button className="service-button">
                  Process Disbursements
                  <span>→</span>
                </button>

              </div>

            </div>

            <div
              className="service-card clickable"
              onClick={() => navigate("/transactions")}
            >

              <div className="service-icon green">
                ↔
              </div>

              <div className="service-content">

                <h3>Transactions</h3>

                <p>
                  Monitor payment transactions and processing status.
                </p>

                <button className="service-button">
                  View Transactions
                  <span>→</span>
                </button>

              </div>

            </div>
          </>
        )}

      </div>

      {/* Recent Activity */}
      <div className="recent-section">

        <div className="section-header">

          <div>
            <h2>Recent Activity</h2>

            <p>
              Latest activity across the platform.
            </p>
          </div>

        </div>

        <div className="activity-card">

          <div className="activity-empty">

            <div className="activity-icon">
              ◷
            </div>

            <h3>No recent activity</h3>

            <p>
              Your recent activity will appear here.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;