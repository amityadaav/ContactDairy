
import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import "./EditContact.css";

const API_URL = import.meta.env.VITE_API_URL;

const initialForm = {
  fname: "",
  lname: "",
  email: "",
  Phone: "",
  workplace: "",
  Address: "",
  Notes: "",
  favorite: false,
};

function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Keep authentication state synchronized.
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

  // Fetch the selected contact.
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      setForm(initialForm);
      return;
    }

    const controller = new AbortController();

    const fetchContact = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error(
            "VITE_API_URL is missing from your .env file."
          );
        }

        if (!id) {
          throw new Error("Contact ID is missing.");
        }

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/api/contact/${encodeURIComponent(id)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
            },
            signal: controller.signal,
          }
        );

        const result = await response.json().catch(() => ({}));

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          return;
        }

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load contact."
          );
        }

        const contact =
          result.payload ||
          result.contact ||
          result.data ||
          result.Contact ||
          result;

        if (
          !contact ||
          typeof contact !== "object" ||
          Array.isArray(contact)
        ) {
          throw new Error("Contact not found.");
        }

        setForm({
          fname: contact.fname || contact.firstName || "",
          lname: contact.lname || contact.lastName || "",
          email: contact.email || contact.Email || "",
          Phone: contact.Phone || contact.phone || "",
          workplace: contact.workplace || "",
          Address: contact.Address || contact.address || "",
          Notes: contact.Notes || contact.notes || "",
          favorite: Boolean(contact.favorite),
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load contact.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchContact();

    return () => controller.abort();
  }, [id, isLoggedIn]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn || saving) return;

    setSaving(true);
    setError("");

    try {
      if (!API_URL) {
        throw new Error(
          "VITE_API_URL is missing from your .env file."
        );
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/contact/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update contact."
        );
      }

      navigate("/contacts", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to update contact.");
    } finally {
      setSaving(false);
    }
  };

  // Do not display the edit page when logged out.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <p className="edit-message">
        Loading contact...
      </p>
    );
  }

  if (error && !form.fname && !form.lname) {
    return (
      <div className="edit-message">
        <p className="edit-error">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/contacts")}
        >
          Back to Contacts
        </button>
      </div>
    );
  }

  return (
    <main className="edit-contact-page">
      <form
        className="edit-contact-form"
        onSubmit={handleSubmit}
      >
        <h1>Edit Contact</h1>
        <p>Update your contact information below.</p>

        {error && (
          <p className="edit-error" role="alert">
            {error}
          </p>
        )}

        <div className="edit-form-grid">
          <label>
            First Name
            <input
              type="text"
              name="fname"
              value={form.fname}
              onChange={handleChange}
              autoComplete="given-name"
              required
            />
          </label>

          <label>
            Last Name
            <input
              type="text"
              name="lname"
              value={form.lname}
              onChange={handleChange}
              autoComplete="family-name"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              name="Phone"
              value={form.Phone}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
          </label>

          <label>
            Workplace
            <input
              type="text"
              name="workplace"
              value={form.workplace}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Address
            <input
              type="text"
              name="Address"
              value={form.Address}
              onChange={handleChange}
              autoComplete="street-address"
              required
            />
          </label>

          <label className="edit-full-width">
            Notes
            <textarea
              name="Notes"
              value={form.Notes}
              onChange={handleChange}
              rows={4}
            />
          </label>

          <label className="edit-favorite">
            <input
              type="checkbox"
              name="favorite"
              checked={form.favorite}
              onChange={handleChange}
            />
            Add to favorites
          </label>
        </div>

        <div className="edit-form-actions">
          <button
            type="button"
            className="edit-cancel-btn"
            onClick={() => navigate("/contacts")}
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditContact;
