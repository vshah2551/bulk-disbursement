import { useNavigate } from "react-router-dom";
import "../css/Scheme.css";

function Scheme() {

  const navigate = useNavigate();

  return (
    <div className="scheme-page">

      <div className="scheme-header">
        <div>
          <h1>Scheme Management</h1>
          <p>Create and manage disbursement schemes.</p>
        </div>

        <button
          className="scheme-back-button"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>
      </div>

      <div className="scheme-actions">

        <div className="scheme-card">

          <div className="scheme-card-icon">
            +
          </div>

          <h2>Create Scheme</h2>

          <p>
            Create a new scheme for bulk disbursement.
          </p>

          <button
            onClick={() => navigate("/create-scheme")}
          >
            Create Scheme
          </button>

        </div>

        <div className="scheme-card">

          <div className="scheme-card-icon">
            ☷
          </div>

          <h2>View Schemes</h2>

          <p>
            View and manage registered schemes.
          </p>

          <button
            onClick={() => navigate("/scheme-list")}
          >
            View Schemes
          </button>

        </div>

      </div>

    </div>
  );
}

export default Scheme;