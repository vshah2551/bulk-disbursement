import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "../css/SchemeList.css";

function SchemeList() {

  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function loadSchemes() {

      try {

        const response = await apiClient.get(
          "/api/schemes"
        );

        setSchemes(response.data);

      } catch (error) {

        console.error(
          "Failed to fetch schemes:",
          error
        );

        if (error.response) {

          setError(
            error.response.data?.message ||
            "Unable to fetch schemes."
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

    loadSchemes();

  }, []);

  return (

    <div className="scheme-list-page">

      <div className="scheme-list-header">

        <div>
          <h1>Schemes</h1>

          <p>
            View registered disbursement schemes.
          </p>
        </div>

        <div className="scheme-list-actions">

          <button
            onClick={() =>
              navigate("/create-scheme")
            }
          >
            + Create Scheme
          </button>

          <button
            className="secondary-button"
            onClick={() =>
              navigate("/schemes")
            }
          >
            Back
          </button>

        </div>

      </div>

      {loading && (
        <div className="scheme-list-message">
          Loading schemes...
        </div>
      )}

      {error && (
        <div className="scheme-list-error">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        schemes.length === 0 && (

          <div className="scheme-list-message">

            <h3>No schemes found</h3>

            <p>
              There are currently no registered schemes.
            </p>

          </div>
        )}

      {!loading &&
        !error &&
        schemes.length > 0 && (

          <div className="scheme-table-container">

            <table className="scheme-table">

              <thead>

                <tr>
                  <th>Scheme Code</th>
                  <th>Scheme Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Created At</th>
                </tr>

              </thead>

              <tbody>

                {schemes.map((scheme) => (

                  <tr key={scheme.id}>

                    <td>
                      <strong>
                        {scheme.schemeCode}
                      </strong>
                    </td>

                    <td>
                      {scheme.schemeName}
                    </td>

                    <td className="description-cell">
                      {scheme.description}
                    </td>

                    <td>

                      <span
                        className={`status-badge ${
                          scheme.status?.toLowerCase()
                        }`}
                      >
                        {scheme.status}
                      </span>

                    </td>

                    <td>
                      {scheme.createdBy}
                    </td>

                    <td>
                      {scheme.createdAt
                        ? new Date(
                            scheme.createdAt
                          ).toLocaleString()
                        : "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

    </div>
  );
}

export default SchemeList;