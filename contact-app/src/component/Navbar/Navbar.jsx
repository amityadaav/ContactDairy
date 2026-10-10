
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, UserRound } from "lucide-react";
import ContactLogo from "../../assets/ContactLogo.png";
import "./Navbar.css";

export const NAV = [
  ["/dashboard", "Dashboard"],
  ["/contacts", "Contacts"],
  ["/allContacts", "All Contacts"],
  ["/favorites", "Favorites"],
  ["/group", "Groups"],
  ["/about", "About"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();


useEffect(() => {
  const loadUser = () => {
    const loggedIn =
      localStorage.getItem("isLoggedIn") === "true";

    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser
        ? JSON.parse(storedUser)
        : null;

      setUser(loggedIn ? parsedUser : null);
    } catch {
      setUser(null);
    }
  };

  loadUser();

  window.addEventListener("auth-change", loadUser);
  window.addEventListener("storage", loadUser);

  return () => {
    window.removeEventListener("auth-change", loadUser);
    window.removeEventListener("storage", loadUser);
  };
}, []);


  const closeMenu = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  // Support common user name fields
  const fullName =
    user?.fullname ||
    user?.fullName ||
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "";

  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

  // First letter of first name + last letter of last name
  const initials = nameParts.length
    ? (
        nameParts[0][0] +
        nameParts[nameParts.length - 1].slice(-1)
      ).toUpperCase()
    : "U";

  const isLoggedIn = Boolean(user);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setProfileOpen(false);
    setOpen(false);

    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="brand-icon">
            <img
              src={ContactLogo}
              className="contact-logo"
              alt="Contact Diary"
            />
          </div>

          <h3>
            Contact<span>Diary</span>
          </h3>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          {NAV.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="nav-actions">
          {!isLoggedIn ? (
            <Link to="/login" className="auth-btn">
              Login
            </Link>
          ) : (
            <div className="profile-wrapper">
              <button
                type="button"
                className="profile-avatar"
                title={fullName || "My Profile"}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                onClick={() =>
                  setProfileOpen((prev) => !prev)
                }
              >
                {initials}
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <div className="profile-avatar small">
                      {initials}
                    </div>

                    <div className="profile-user-details">
                      <strong>{fullName || "User"}</strong>
                      <span>{user?.email || ""}</span>
                    </div>
                  </div>

                  <div className="profile-divider" />

                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      closeMenu();
                      navigate("/profile");
                    }}
                  >
                    <UserRound size={17} />
                    My Profile
                  </button>

                  <button
                    type="button"
                    className="profile-menu-item logout-item"
                    onClick={handleLogout}
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {isLoggedIn && (
            <Link
              to="/addContact"
              className="cta-btn"
              onClick={closeMenu}
            >
              Add Contact
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="menu-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <nav className="mobile-menu">
          {isLoggedIn &&
            NAV.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                {label}
              </NavLink>
            ))}

          {!isLoggedIn ? (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                Login
              </NavLink>

              <NavLink to="/signup" onClick={closeMenu}>
                Sign Up
              </NavLink>
            </>
          ) : (
            <>
              <div className="mobile-profile-info">
                <div className="profile-avatar">
                  {initials}
                </div>

                <div className="profile-user-details">
                  <strong>{fullName || "User"}</strong>
                  <span>{user?.email || ""}</span>
                </div>
              </div>

              <NavLink to="/profile" onClick={closeMenu}>
                My Profile
              </NavLink>

              <button
                type="button"
                className="mobile-logout"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Logout
              </button>

              <Link
                to="/addContact"
                className="full"
                onClick={closeMenu}
              >
                Add Contact
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
