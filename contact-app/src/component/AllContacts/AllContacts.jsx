
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Star,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import "./AllContacts.css";

const API_URL =import.meta.env.VITE_API_URL;
const FAVORITES_KEY = "contactDiaryFavoriteIds";

function AllContacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  // Keep login state synchronized with the rest of the application.
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

  // Fetch contacts only when logged in.
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
        const token = localStorage.getItem("token");

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
          signal: controller.signal,
        });

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

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.contacts)
          ? data.contacts
          : Array.isArray(data.payload)
          ? data.payload
          : Array.isArray(data.data)
          ? data.data
          : [];

        let favoriteIds = [];

        try {
          const saved = JSON.parse(
            localStorage.getItem(FAVORITES_KEY) || "[]"
          );

          favoriteIds = Array.isArray(saved) ? saved : [];
        } catch {
          favoriteIds = [];
        }

        const formatted = list.map((contact) => {
          const first = contact.fname || contact.firstName || "";
          const last = contact.lname || contact.lastName || "";
          const name =
            contact.name ||
            `${first} ${last}`.trim() ||
            "Unnamed Contact";

          const id = String(contact._id || contact.id || "");

          return {
            ...contact,
            id,
            name,
            email: contact.email || "",
            phone: contact.Phone || contact.phone || "",
            company:
              contact.company ||
              contact.workplace ||
              "",
            address:
              contact.Address ||
              contact.address ||
              "",
            favorite:
              favoriteIds.includes(id) ||
              Boolean(contact.favorite),
            initials: name
              .split(/\s+/)
              .filter(Boolean)
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
          };
        });

        setContacts(formatted);
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

  // Toggle and save favorites.
  const toggleFavorite = (id) => {
    setContacts((previous) => {
      const updated = previous.map((contact) =>
        contact.id === id
          ? { ...contact, favorite: !contact.favorite }
          : contact
      );

      const favoriteIds = updated
        .filter((contact) => contact.favorite)
        .map((contact) => contact.id);

      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favoriteIds)
      );

      return updated;
    });
  };

  const deleteContact = (id) => {
    const contact = contacts.find((item) => item.id === id);

    if (!contact) return;

    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;

    const id = contactToDelete.id;

    try {
      setDeletingId(id);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
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

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Unable to delete contact (${response.status})`
        );
      }

      setContacts((previous) =>
        previous.filter((contact) => contact.id !== id)
      );

      const favoriteIds = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || "[]"
      );

      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(
          favoriteIds.filter((favoriteId) => favoriteId !== id)
        )
      );

      setShowDeleteModal(false);
      setContactToDelete(null);
    } catch (err) {
      setError(err.message || "Failed to delete contact.");
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const matchesSearch = [
        contact.name,
        contact.email,
        contact.phone,
        contact.company,
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

  // Hide all private page content if logged out.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <main className="all-contacts-page">
        <div className="all-contacts-container">
          <p>Loading contacts...</p>
        </div>
      </main>
    );
  }

  if (error && contacts.length === 0) {
    return (
      <main className="all-contacts-page">
        <div className="all-contacts-container">
          <h2>Unable to load contacts</h2>
          <p role="alert">{error}</p>
          <button
            type="button"
            className="all-clear-button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
          <p>
            <Link to="/dashboard">Back to dashboard</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="all-contacts-page">
      <div className="all-contacts-container">
        <Link to="/dashboard" className="all-back-link">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <header className="all-contacts-header">
          <div>
            <span className="all-eyebrow">
              YOUR PERSONAL DIRECTORY
            </span>
            <h1>
              All <span>contacts.</span>
            </h1>
            <p>
              Everyone you know, organized in one thoughtful place.
            </p>
          </div>

          <Link to="/addContact" className="all-add-button">
            <Plus size={18} /> Add contact
          </Link>
        </header>

        <section className="all-stats">
          <div className="all-stat-card">
            <Users size={21} />
            <div>
              <span>Total contacts</span>
              <strong>{contacts.length}</strong>
            </div>
          </div>

          <div className="all-stat-card">
            <Star size={21} />
            <div>
              <span>Favorites</span>
              <strong>{favoriteCount}</strong>
            </div>
          </div>
        </section>

        {error && (
          <p role="alert" className="all-error-message">
            {error}
          </p>
        )}

        <section className="all-contacts-panel">
          <div className="all-toolbar">
            <div className="all-search">
              <Search size={19} />
              <input
                type="search"
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search all contacts"
              />
            </div>

            <div className="all-filter-buttons">
              <button
                type="button"
                className={filter === "all" ? "selected" : ""}
                onClick={() => setFilter("all")}
              >
                All contacts
              </button>

              <button
                type="button"
                className={
                  filter === "favorites" ? "selected" : ""
                }
                onClick={() => setFilter("favorites")}
              >
                <Star size={14} /> Favorites
              </button>
            </div>
          </div>

          <div className="all-results-heading">
            <h2>
              {filter === "favorites"
                ? "Favorite people"
                : "Your directory"}
            </h2>
            <span>{filteredContacts.length} found</span>
          </div>

          {filteredContacts.length > 0 ? (
            <div className="all-contact-grid">
              {filteredContacts.map((contact) => (
                <article
                  className="all-contact-card"
                  key={contact.id}
                >
                  <div className="all-card-top">
                    <div className="all-avatar">
                      {contact.initials || "?"}
                    </div>

                    <div className="all-card-actions">
                      <button
                        type="button"
                        className={`all-icon-button ${
                          contact.favorite ? "favorite-active" : ""
                        }`}
                        onClick={() => toggleFavorite(contact.id)}
                        aria-label={
                          contact.favorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        aria-pressed={contact.favorite}
                      >
                        <Star
                          size={18}
                          fill={
                            contact.favorite
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                      <button
                        type="button"
                        className="all-icon-button delete-button"
                        onClick={() => deleteContact(contact.id)}
                        disabled={deletingId === contact.id}
                        aria-label={`Delete ${contact.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  <h3>{contact.name}</h3>

                  <p className="all-company">
                    {contact.company || "Personal connection"}
                  </p>

                  <div className="all-card-divider" />

                  <div className="all-contact-detail">
                    <Mail size={15} />
                    <span>{contact.email || "No email added"}</span>
                  </div>

                  <div className="all-contact-detail">
                    <Phone size={15} />
                    <span>{contact.phone || "No phone added"}</span>
                  </div>

                  {contact.address && (
                    <div className="all-contact-detail">
                      <MapPin size={15} />
                      <span>{contact.address}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="all-empty-state">
              <div className="all-empty-icon">
                <Users size={27} />
              </div>

              <h3>
                {contacts.length === 0
                  ? "Your directory is waiting"
                  : "No contacts found"}
              </h3>

              <p>
                {contacts.length === 0
                  ? "Add your first contact to get started."
                  : "Try another search or switch your filter."}
              </p>

              {contacts.length === 0 ? (
                <Link
                  to="/addContact"
                  className="all-add-button"
                >
                  <Plus size={17} /> Add your first contact
                </Link>
              ) : (
                <button
                  type="button"
                  className="all-clear-button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>

        <footer className="all-contacts-footer">
          <span>ContactDiary</span>
          <span>Your connections, thoughtfully organized.</span>
        </footer>
      </div>

      {showDeleteModal && contactToDelete && (
        <div className="delete-modal-overlay">
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div className="delete-modal-icon">
              <span>!</span>
            </div>

            <h2 id="delete-modal-title">Delete Contact?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{contactToDelete.name}</strong>? This action
              cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="cancel-delete-btn"
                onClick={cancelDelete}
                disabled={deletingId === contactToDelete.id}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-btn"
                onClick={confirmDelete}
                disabled={deletingId === contactToDelete.id}
              >
                {deletingId === contactToDelete.id
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AllContacts;
