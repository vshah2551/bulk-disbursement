import { useNavigate } from "react-router-dom";
import "../css/Payees.css";
import { isOperator, isAdmin } from "../utils/auth";

function Payees() {
  const navigate = useNavigate();

  const canCreatePayee = isOperator() || isAdmin();

  return (
    <div className="payees-page">

      <div className="payees-header">

        <div>
          <h1>Payee Management</h1>

          <p>
            Manage registered payees for the disbursement platform.
          </p>
        </div>

      </div>

      <div className="payees-content">

        {canCreatePayee && (
          <div className="payee-card">

            <div className="payee-card-icon">
              +
            </div>

            <div className="payee-card-content">

              <h2>Create Payee</h2>

              <p>
                Register a new payee who can receive
                disbursement payments.
              </p>

              <button
                onClick={() => navigate("/payees/create")}
              >
                Add Payee
              </button>

            </div>

          </div>
        )}

        <div className="payee-card">

          <div className="payee-card-icon">
            👥
          </div>

          <div className="payee-card-content">

            <h2>View Payees</h2>

            <p>
              View registered payees and their details.
            </p>

            <button
              onClick={() => navigate("/payees/list")}
            >
              View Payees
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Payees;