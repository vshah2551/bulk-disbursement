import { Link, useNavigate } from "react-router-dom";
import "../css/Header.css";

function Header({ isLoggedIn, setIsLoggedIn }) {

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");

    setIsLoggedIn(false);

    navigate("/login");
  }

  return (
    <nav className="navbar">

      <h2 className="navbar-title">
        Bulk Disbursement Platform
      </h2>

      <div className="nav-links">

        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="nav-link"
            >
              Dashboard
            </Link>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="nav-link"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-button"
            >
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Header;