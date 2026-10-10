
import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Star,
  UserPlus,
  Search,
  ArrowUpRight,
  Mail,
  Phone,
  MoreHorizontal,
  ContactRound,
} from "lucide-react";
import {
  Link,
  Navigate,
} from "react-router-dom";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  // Keep authentication state synchronized with login/logout.
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(
        localStorage.getItem("isLoggedIn") === "true"
      );
    };

    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setContacts([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchContacts() {
      setLoading(true);
      setError("");

      try {
        if (!API_URL) {
          throw new Error(
            "API URL is missing. Add VITE_API_URL to your .env file."
          );
        }

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/api/contact`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
            },
            signal: controller.signal,
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setIsLoggedIn(false);
          window.dispatchEvent(new Event("auth-change"));
          return;
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Failed to fetch contacts (${response.status})`
          );
        }

        const contactList = Array.isArray(data)
          ? data
          : Array.isArray(data.contacts)
          ? data.contacts
          : Array.isArray(data.payload)
          ? data.payload
          : Array.isArray(data.data)
          ? data.data
          : [];

        const formattedContacts = contactList.map((contact) => {
          const firstName =
            contact.fname || contact.firstName || "";

          const lastName =
            contact.lname || contact.lastName || "";

          const fullName =
            contact.name ||
            `${firstName} ${lastName}`.trim() ||
            "Unnamed Contact";

          return {
            ...contact,
            id: contact._id || contact.id,
            name: fullName,
            email: contact.email || "",
            phone: contact.Phone || contact.phone || "",
            favorite: Boolean(contact.favorite),
            initials: (
              `${firstName[0] || fullName[0] || ""}${
                lastName[0] || ""
              }`
            ).toUpperCase(),
          };
        });

        setContacts(formattedContacts);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message ||
              "Unable to load contacts. Check your backend server."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchContacts();

    return () => controller.abort();
  }, [isLoggedIn]);

  // Do not render private dashboard content without login.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const toggleFavorite = (id) => {
    setContacts((previousContacts) =>
      previousContacts.map((contact) =>
        contact.id === id
          ? { ...contact, favorite: !contact.favorite }
          : contact
      )
    );
  };

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const matchesSearch = [
        contact.name,
        contact.email,
        contact.phone,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesFilter =
        filter === "all" ||
        (filter === "favorites" && contact.favorite);

      return matchesSearch && matchesFilter;
    });
  }, [contacts, search, filter]);

  const favoriteCount = contacts.filter(
    (contact) => contact.favorite
  ).length;

  if (loading) {
    return (
      <main className="dashboard">
        <div className="dashboard-container">
          <p>Loading contacts...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard">
        <div className="dashboard-container">
          <h2>Unable to load contacts</h2>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              YOUR PERSONAL ADDRESS BOOK
            </span>

            <h1>
              Good to see you<span>.</span>
            </h1>

            <p>
              Keep your people close and your connections organized.
            </p>
          </div>

          <Link to="/addContact" className="dashboard-add-btn">
            <UserPlus size={18} />
            <span>Add contact</span>
          </Link>
        </header>

        <section className="dashboard-stats">
          <article className="stat-card">
            <div className="stat-icon moss-icon">
              <Users size={21} />
            </div>

            <div>
              <p>Total contacts</p>
              <h2>{contacts.length}</h2>
              <span>Your personal directory</span>
            </div>

            <ContactRound
              className="stat-watermark"
              size={55}
            />
          </article>

          <article className="stat-card">
            <div className="stat-icon yellow-icon">
              <Star size={21} />
            </div>

            <div>
              <p>Favorites</p>
              <h2>{favoriteCount}</h2>
              <span>Your closest connections</span>
            </div>

            <Star className="stat-watermark" size={55} />
          </article>

          <article className="stat-card stat-action">
            <div className="stat-icon light-icon">
              <UserPlus size={21} />
            </div>

            <div>
              <p>Grow your directory</p>
              <h2>Meet someone new?</h2>

              <Link to="/addContact">
                Save their details <ArrowUpRight size={15} />
              </Link>
            </div>
          </article>
        </section>

        <section className="dashboard-content">
          <div className="contacts-panel">
            <div className="panel-heading">
              <div>
                <span className="section-eyebrow">
                  YOUR DIRECTORY
                </span>
                <h2>Recent contacts</h2>
              </div>

              <Link to="/contacts" className="view-all-link">
                View all <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="contacts-toolbar">
              <div className="dashboard-search">
                <Search size={18} />

                <input
                  type="search"
                  placeholder="Search name, email or phone..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  aria-label="Search contacts"
                />
              </div>

              <div className="contact-filters">
                <button
                  type="button"
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All contacts
                </button>

                <button
                  type="button"
                  className={
                    filter === "favorites" ? "active" : ""
                  }
                  onClick={() => setFilter("favorites")}
                >
                  <Star size={14} />
                  Favorites
                </button>
              </div>
            </div>

            <div className="contacts-list">
              {filteredContacts.length > 0 ? (
                filteredContacts.slice(0, 6).map((contact) => (
                  <article
                    className="dashboard-contact"
                    key={contact.id}
                  >
                    <div className="contact-avatar">
                      {contact.initials || "UC"}
                    </div>

                    <div className="contact-main">
                      <h3>{contact.name}</h3>

                      <span className="contact-email">
                        <Mail size={14} />
                        {contact.email || "No email provided"}
                      </span>
                    </div>

                    <div className="contact-phone">
                      <Phone size={14} />
                      {contact.phone || "No phone provided"}
                    </div>

                    <button
                      type="button"
                      className={`favorite-btn ${
                        contact.favorite ? "is-favorite" : ""
                      }`}
                      onClick={() => toggleFavorite(contact.id)}
                      aria-label={
                        contact.favorite
                          ? `Remove ${contact.name} from favorites`
                          : `Add ${contact.name} to favorites`
                      }
                      aria-pressed={contact.favorite}
                    >
                      <Star
                        size={19}
                        fill={
                          contact.favorite
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <button
                      type="button"
                      className="contact-more"
                      aria-label={`View details for ${contact.name}`}
                      onClick={() =>
                        window.alert(
                          `Name: ${contact.name}\nEmail: ${
                            contact.email || "Not provided"
                          }\nPhone: ${
                            contact.phone || "Not provided"
                          }`
                        )
                      }
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </article>
                ))
              ) : (
                <div className="dashboard-empty">
                  <Search size={27} />
                  <h3>No contacts found</h3>
                  <p>
                    Try another search or change your filter.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <div className="contacts-footer">
              Showing {Math.min(filteredContacts.length, 6)} of{" "}
              {filteredContacts.length} matching contacts
            </div>
          </div>

          <aside className="dashboard-sidebar">
            <div className="welcome-card">
              <div className="welcome-decoration">✳</div>

              <span className="section-eyebrow">
                A LITTLE REMINDER
              </span>

              <h2>
                Good relationships start with remembering.
              </h2>

              <p>
                Keep phone numbers, emails, and the people who
                matter all in one thoughtful place.
              </p>

              <Link to="/addContact" className="welcome-link">
                Add someone new <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="quick-actions">
              <span className="section-eyebrow">
                QUICK ACTIONS
              </span>

              <Link to="/addContact">
                <span className="quick-action-icon">
                  <UserPlus size={18} />
                </span>

                <span>
                  <strong>Add a contact</strong>
                  <small>Save someone new</small>
                </span>

                <ArrowUpRight size={17} />
              </Link>

              <Link to="/contacts">
                <span className="quick-action-icon">
                  <Users size={18} />
                </span>

                <span>
                  <strong>Browse directory</strong>
                  <small>Find your connections</small>
                </span>

                <ArrowUpRight size={17} />
              </Link>

              <Link to="/contacts?filter=favorites">
                <span className="quick-action-icon">
                  <Star size={18} />
                </span>

                <span>
                  <strong>Your favorites</strong>
                  <small>People you reach for most</small>
                </span>

                <ArrowUpRight size={17} />
              </Link>
            </div>
          </aside>
        </section>

        <footer className="dashboard-footer">
          <span>ContactDiary</span>
          <span>A quieter way to keep in touch.</span>
        </footer>
      </div>
    </main>
  );
}

export default Dashboard;
