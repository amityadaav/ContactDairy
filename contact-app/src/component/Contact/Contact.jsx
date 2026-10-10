
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  UserRound,
  Star,
  Trash2,
  Pencil,
  Mail,
  Phone,
  Building2,
  MapPin,
  ContactRound,
} from "lucide-react";
import "./Contact.css";

// Backend API URL
const API_URL = import.meta.env.VITE_API_URL;

const CONTACTS_URL = `${API_URL}/api/contact`;

function Contact() {
  // Store contacts and UI states
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch contacts from the backend
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(CONTACTS_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch contacts."
        );
      }

      setContacts(
        Array.isArray(result.payload) ? result.payload : []
      );
    } catch (err) {
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // Load contacts when the page opens
  useEffect(() => {
    fetchContacts();
  }, []);

  // Add or remove a contact from favorites
  const toggleFavorite = async (contact) => {
    try {
      const response = await fetch(
        `${CONTACTS_URL}/${contact._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            favorite: !contact.favorite,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update favorite."
        );
      }

      // Update the contact returned by the backend
      setContacts((previous) =>
        previous.map((item) =>
          item._id === contact._id
            ? result.payload
            : item
        )
      );
    } catch (err) {
      alert(err.message || "Unable to update favorite.");
    }
  };

  // Delete a contact from the backend
  const deleteContact = async (contact) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${contact.fname || "this contact"}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${CONTACTS_URL}/${contact._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete contact."
        );
      }

      // Remove deleted contact from the UI
      setContacts((previous) =>
        previous.filter(
          (item) => item._id !== contact._id
        )
      );
    } catch (err) {
      alert(err.message || "Unable to delete contact.");
    }
  };

  // Search contacts and apply the selected filter
  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const name =
        `${contact.fname || ""} ${contact.lname || ""}`.trim();

      const matchesSearch = [
        name,
        contact.email,
        contact.Phone,
        contact.workplace,
        contact.Address,
        contact.Notes,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesFilter =
        filter === "all" ||
        (filter === "favorites" && contact.favorite === true);

      return matchesSearch && matchesFilter;
    });
  }, [contacts, search, filter]);

  // Calculate favorite count
  const favoriteCount = contacts.filter(
    (contact) => contact.favorite
  ).length;

  return (
    <main className="contact-page">
      <div className="contact-container">
        {/* Page heading */}
        <header className="contact-header">
          <div>
            <span className="contact-eyebrow">
              YOUR PERSONAL ADDRESS BOOK
            </span>

            <h1>
              All Contacts<span>.</span>
            </h1>

            <p>
              Everyone important, gathered in one thoughtful place.
            </p>
          </div>

          <Link
            to="/addContact"
            className="contact-add-btn"
          >
            <Plus size={19} />
            Add Contact
          </Link>
        </header>

        {/* Search and filters */}
        <section className="contact-toolbar">
          <div className="contact-search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Search name, email, phone or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="contact-filters">
            <button
              type="button"
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All Contacts
              <span>{contacts.length}</span>
            </button>

            <button
              type="button"
              className={
                filter === "favorites" ? "active" : ""
              }
              onClick={() => setFilter("favorites")}
            >
              <Star size={15} />
              Favorites
              <span>{favoriteCount}</span>
            </button>
          </div>
        </section>

        {/* Results heading */}
        <div className="contact-results-heading">
          <div>
            <h2>Your people</h2>
            <p>
              {filteredContacts.length}{" "}
              {filteredContacts.length === 1
                ? "contact"
                : "contacts"}{" "}
              found
            </p>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="contact-empty">
            <p>Loading contacts...</p>
          </div>
        ) : error ? (
          /* Error state */
          <div className="contact-empty">
            <h3>Unable to load contacts</h3>
            <p>{error}</p>

            <button
              type="button"
              className="contact-empty-btn"
              onClick={fetchContacts}
            >
              Try Again
            </button>
          </div>
        ) : filteredContacts.length > 0 ? (
          /* Contact cards */
          <section className="contact-grid">
            {filteredContacts.map((contact) => {
              const id = contact._id;

              const initials =
                `${contact.fname?.[0] || ""}${
                  contact.lname?.[0] || ""
                }`.toUpperCase();

              const name =
                `${contact.fname || ""} ${
                  contact.lname || ""
                }`.trim() || "Unnamed Contact";

              return (
                <article
                  className="contact-card"
                  key={id}
                >
                  {/* Avatar and action buttons */}
                  <div className="contact-card-top">
                    <div className="contact-avatar">
                      {initials || <UserRound size={25} />}
                    </div>

                    <div className="contact-card-actions">
                      {/* Favorite button */}
                      <button
                        type="button"
                        className={`contact-icon-btn ${
                          contact.favorite ? "is-favorite" : ""
                        }`}
                        onClick={() => toggleFavorite(contact)}
                        aria-label={
                          contact.favorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        title="Toggle favorite"
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

                      {/* Edit button */}
<Link
  to={`/editContact/${contact._id}`}
  className="contact-icon-btn edit"
  title="Edit contact"
  aria-label="Edit contact"
>
  <Pencil size={17} />
</Link>

                      {/* Delete button */}
                      <button
                        type="button"
                        className="contact-icon-btn delete"
                        onClick={() => deleteContact(contact)}
                        aria-label="Delete contact"
                        title="Delete contact"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  {/* Contact name and workplace */}
                  <h3>{name}</h3>

                  <p className="contact-company">
                    <Building2 size={14} />
                    {contact.workplace || "Personal contact"}
                  </p>

                  {/* Contact information */}
                  <div className="contact-details">
                    {contact.email && (
                      <p>
                        <Mail size={15} />
                        <a href={`mailto:${contact.email}`}>
                          {contact.email}
                        </a>
                      </p>
                    )}

                    {contact.Phone && (
                      <p>
                        <Phone size={15} />
                        <a href={`tel:${contact.Phone}`}>
                          {contact.Phone}
                        </a>
                      </p>
                    )}

                    {contact.Address && (
                      <p>
                        <MapPin size={15} />
                        <span>{contact.Address}</span>
                      </p>
                    )}
                  </div>

                  {/* Optional notes */}
                  {contact.Notes && (
                    <p className="contact-notes">
                      {contact.Notes}
                    </p>
                  )}
                </article>
              );
            })}
          </section>
        ) : (
          /* Empty state */
          <div className="contact-empty">
            <div className="contact-empty-icon">
              <ContactRound size={30} />
            </div>

            <h3>
              {search || filter === "favorites"
                ? "No matching contacts"
                : "Your address book is waiting"}
            </h3>

            <p>
              {search || filter === "favorites"
                ? "Try another search or switch to all contacts."
                : "Add your first contact and keep your important connections close."}
            </p>

            {search || filter === "favorites" ? (
              <button
                type="button"
                className="contact-empty-btn"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/addContact"
                className="contact-empty-btn"
              >
                <Plus size={17} />
                Create First Contact
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Contact;
