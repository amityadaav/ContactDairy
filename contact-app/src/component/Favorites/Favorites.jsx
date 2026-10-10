
import React, { useEffect, useMemo, useState } from "react";
import {
  Star,
  Search,
  Mail,
  Phone,
  MapPin,
  Trash2,
  ArrowLeft,
  Users,
  Plus,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Favorites.css";

function Favorites() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("contactDiaryContacts") || "[]"
      );
      setContacts(Array.isArray(saved) ? saved : []);
    } catch {
      setContacts([]);
    }
  }, []);

  const favorites = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const isFavorite = contact.favorite === true;
      const name =
        contact.name ||
        `${contact.firstName || ""} ${contact.lastName || ""}`.trim();

      const matchesSearch = [
        name,
        contact.email,
        contact.phone,
        contact.company,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      return isFavorite && matchesSearch;
    });
  }, [contacts, search]);

  const saveContacts = (updatedContacts) => {
    setContacts(updatedContacts);
    localStorage.setItem(
      "contactDiaryContacts",
      JSON.stringify(updatedContacts)
    );
  };

  const removeFavorite = (id) => {
    saveContacts(
      contacts.map((contact) =>
        contact.id === id ? { ...contact, favorite: false } : contact
      )
    );
  };


const deleteContact = (contact) => {
  setContactToDelete(contact);
  setShowDeleteModal(true);
};

const confirmDelete = () => {
  if (!contactToDelete || deleting) return;

  try {
    setDeleting(true);

    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactToDelete.id
    );

    saveContacts(updatedContacts);
    setShowDeleteModal(false);
    setContactToDelete(null);
  } finally {
    setDeleting(false);
  }
};

const cancelDelete = () => {
  if (deleting) return;

  setShowDeleteModal(false);
  setContactToDelete(null);
};


  const totalFavorites = contacts.filter(
    (contact) => contact.favorite === true
  ).length;

  return (
    <main className="favorites-page">
      <div className="favorites-container">
        <Link to="/dashboard" className="favorites-back">
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <header className="favorites-header">
          <div>
            <span className="favorites-eyebrow">
              THE PEOPLE WHO MATTER MOST
            </span>
            <h1>Your <span>favorites.</span></h1>
            <p>
              A little space for the people you want to keep close.
            </p>
          </div>

          <Link to="/addContact" className="favorites-add-btn">
            <Plus size={17} />
            Add contact
          </Link>
        </header>

        <section className="favorites-summary">
          <div className="favorites-summary-icon">
            <Heart size={25} fill="currentColor" />
          </div>
          <div>
            <span>YOUR FAVORITE PEOPLE</span>
            <h2>{totalFavorites}</h2>
            <p>
              {totalFavorites === 1
                ? "One person close to your heart."
                : `${totalFavorites} people saved for quick access.`}
            </p>
          </div>
          <Star className="favorites-summary-watermark" size={100} />
        </section>

        <section className="favorites-list-section">
          <div className="favorites-section-heading">
            <div>
              <span className="favorites-small-label">YOUR INNER CIRCLE</span>
              <h2>Favorite contacts</h2>
            </div>
            <span className="favorites-count">
              {favorites.length} shown
            </span>
          </div>

          <div className="favorites-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search your favorites..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search favorite contacts"
            />
          </div>

          {favorites.length > 0 ? (
            <div className="favorites-grid">
              {favorites.map((contact) => {
                const name =
                  contact.name ||
                  `${contact.firstName || ""} ${contact.lastName || ""}`.trim();

                const initials =
                  contact.initials ||
                  name
                    .split(" ")
                    .filter(Boolean)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                return (
                  <article className="favorite-contact-card" key={contact.id}>
                    <div className="favorite-card-top">
                      <div className="favorite-avatar">{initials || "?"}</div>

                      <span className="favorite-badge">
                        <Star size={12} fill="currentColor" />
                        Favorite
                      </span>
                    </div>

                    <h3>{name || "Unnamed contact"}</h3>
                    <p className="favorite-company">
                      {contact.company || "Personal connection"}
                    </p>

                    <div className="favorite-divider" />

                    <div className="favorite-detail">
                      <Mail size={15} />
                      <span>{contact.email || "No email added"}</span>
                    </div>

                    <div className="favorite-detail">
                      <Phone size={15} />
                      <span>{contact.phone || "No phone added"}</span>
                    </div>

                    {contact.address && (
                      <div className="favorite-detail">
                        <MapPin size={15} />
                        <span>{contact.address}</span>
                      </div>
                    )}

                    {contact.notes && (
                      <p className="favorite-notes">{contact.notes}</p>
                    )}

                    <div className="favorite-card-actions">
                      <button
                        type="button"
                        className="remove-favorite-btn"
                        onClick={() => removeFavorite(contact.id)}
                      >
                        <Star size={15} />
                        Remove favorite
                      </button>

<button
  type="button"
  className="delete-favorite-btn"
  onClick={() => deleteContact(contact)}
  aria-label={`Delete ${name}`}
  title="Delete contact"
>
  <Trash2 size={16} />
</button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="favorites-empty">
              <div className="favorites-empty-icon">
                <Heart size={28} />
              </div>
              <h3>
                {totalFavorites === 0
                  ? "Your inner circle starts here"
                  : "No matching favorites"}
              </h3>
              <p>
                {totalFavorites === 0
                  ? "Star a contact in your directory to see them here."
                  : "Try another search to find your favorite person."}
              </p>

              {totalFavorites === 0 ? (
                <Link to="/contacts" className="favorites-empty-btn">
                  <Users size={16} />
                  Browse all contacts
                </Link>
              ) : (
                <button
                  type="button"
                  className="favorites-empty-btn"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </section>

        <footer className="favorites-footer">
          <Star size={14} fill="currentColor" />
          <span>Some people deserve a place of their own.</span>
        </footer>

  
{showDeleteModal && contactToDelete && (
  <div
    className="delete-modal-overlay"
    onClick={cancelDelete}
  >
    <div
      className="delete-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="delete-modal-icon">
        <Trash2 size={26} />
      </div>

      <h2 id="delete-modal-title">Delete contact?</h2>

      <p>
        Are you sure you want to permanently delete{" "}
        <strong>
          {contactToDelete.name ||
            `${contactToDelete.firstName || ""} ${
              contactToDelete.lastName || ""
            }`.trim() ||
            "this contact"}
        </strong>
        ? This action cannot be undone.
      </p>

      <div className="delete-modal-actions">
        <button
          type="button"
          className="cancel-delete-btn"
          onClick={cancelDelete}
          disabled={deleting}
        >
          Cancel
        </button>

        <button
          type="button"
          className="confirm-delete-btn"
          onClick={confirmDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </main>
  );
}

export default Favorites;
