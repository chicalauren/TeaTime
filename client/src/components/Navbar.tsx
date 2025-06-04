import { Link, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/auth";
import { Collapse } from "bootstrap";

function Navbar() {
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    removeToken();
    window.dispatchEvent(new Event("teatime-logout"));
    navigate("/");
  };

  const handleNavLinkClick = () => {
    const collapseElement = document.getElementById("navbarNavDropdown");
    if (collapseElement?.classList.contains("show")) {
      const bsCollapse = new Collapse(collapseElement, {
        toggle: true,
      });
      bsCollapse.hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container justify-content-center">
        <Link className="navbar-brand" to="/" onClick={handleNavLinkClick}>
          TeaTime
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard" onClick={handleNavLinkClick}>
                Dashboard
              </Link>
            </li>
            {token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/spill" onClick={handleNavLinkClick}>
                    🫖 Social
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/favorites" onClick={handleNavLinkClick}>
                    ❤️ Favorites
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teatimer" onClick={handleNavLinkClick}>
                    ⏲️ Tea Timer
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile" onClick={handleNavLinkClick}>
                    👤 Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/friends" onClick={handleNavLinkClick}>
                    👥 Friends
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger ms-2"
                    onClick={() => {
                      handleLogout();
                      handleNavLinkClick();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={handleNavLinkClick}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={handleNavLinkClick}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
