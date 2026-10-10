
import React, { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  Star,
  ArrowLeft,
  Save,
  X,
  ContactRound,
} from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./AddContact.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AddContact() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    notes: "",
    favorite: false,
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const initials =
    `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`
      .toUpperCase() || "?";

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      form: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (
      formData.phone.trim() &&
      !/^[+()\d\s-]{7,20}$/.test(formData.phone.trim())
    ) {
      newErrors.phone = "Enter a valid phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm() || saving) return;

    if (localStorage.getItem("isLoggedIn") !== "true") {
      setIsLoggedIn(false);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fname: formData.firstName.trim(),
          lname: formData.lastName.trim(),
          email: formData.email.trim(),
          Phone: formData.phone.trim(),
          workplace: formData.company.trim(),
          Address: formData.address.trim(),
          Notes: formData.notes.trim(),
          favorite: formData.favorite,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        window.dispatchEvent(new Event("auth-change"));
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save contact."
        );
      }

      setSaved(true);

      // Navigate to the contacts page after saving.
      setTimeout(() => {
        navigate("/contacts");
      }, 900);
    } catch (error) {
      console.error("Contact submission error:", error);

      setErrors({
        form: error.message || "Unable to connect to the server.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="add-contact-page">
      <div className="add-contact-container">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <header className="add-contact-header">
          <span className="add-eyebrow">
            YOUR PERSONAL ADDRESS BOOK
          </span>

          <h1>
            Make a new <span>connection.</span>
          </h1>

          <p>
            Add someone's details and keep them close whenever
            you need them.
          </p>
        </header>

        {saved && (
          <div className="success-message" role="status">
            Contact saved successfully! Redirecting to your contacts...
          </div>
        )}

        {errors.form && (
          <div className="form-error-message" role="alert">
            {errors.form}
          </div>
        )}

        <div className="add-contact-layout">
          <form
            className="contact-form-card"
            onSubmit={handleSubmit}
          >
            <div className="form-card-heading">
              <div className="form-heading-icon">
                <ContactRound size={21} />
              </div>

              <div>
                <h2>Contact details</h2>
                <p>Fields marked with * are required.</p>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">
                Basic information
              </h3>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="firstName">First name *</label>

                  <div className="field-input">
                    <UserRound size={17} />

                    <input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="e.g. Alex"
                      autoComplete="given-name"
                      required
                    />
                  </div>

                  {errors.firstName && (
                    <small className="field-error">
                      {errors.firstName}
                    </small>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="lastName">Last name *</label>

                  <div className="field-input">
                    <UserRound size={17} />

                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Smith"
                      autoComplete="family-name"
                      required
                    />
                  </div>

                  {errors.lastName && (
                    <small className="field-error">
                      {errors.lastName}
                    </small>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email address</label>

                  <div className="field-input">
                    <Mail size={17} />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@example.com"
                      autoComplete="email"
                    />
                  </div>

                  {errors.email && (
                    <small className="field-error">
                      {errors.email}
                    </small>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="phone">Phone number</label>

                  <div className="field-input">
                    <Phone size={17} />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                    />
                  </div>

                  {errors.phone && (
                    <small className="field-error">
                      {errors.phone}
                    </small>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="company">
                    Company or workplace
                  </label>

                  <div className="field-input">
                    <BriefcaseBusiness size={17} />

                    <input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Where they work"
                      autoComplete="organization"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="address">Address</label>

                  <div className="field-input">
                    <MapPin size={17} />

                    <input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="City, state or street"
                      autoComplete="street-address"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section notes-section">
              <h3 className="form-section-title">A little more</h3>

              <div className="form-field">
                <label htmlFor="notes">Notes</label>

                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Birthday, how you met, or anything you want to remember..."
                  rows={4}
                />
              </div>
            </div>

            <label className="favorite-option">
              <span className="favorite-option-icon">
                <Star size={18} />
              </span>

              <span className="favorite-option-text">
                <strong>Add to favorites</strong>
                <small>
                  Keep this person close in your directory.
                </small>
              </span>

              <input
                type="checkbox"
                name="favorite"
                checked={formData.favorite}
                onChange={handleChange}
              />

              <span
                className="favorite-toggle"
                aria-hidden="true"
              />
            </label>

            <div className="form-actions">
              <Link to="/contacts" className="cancel-btn">
                <X size={17} />
                Cancel
              </Link>

              <button
                type="submit"
                className="save-contact-btn"
                disabled={saving || saved}
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save contact"}
              </button>
            </div>
          </form>

          <aside className="contact-preview-column">
            <div className="contact-preview-card">
              <span className="preview-label">LIVE PREVIEW</span>

              <div className="preview-avatar">
                {initials}

                {formData.favorite && (
                  <span className="preview-favorite">
                    <Star size={13} fill="currentColor" />
                  </span>
                )}
              </div>

              <h2>
                {formData.firstName || formData.lastName
                  ? `${formData.firstName} ${formData.lastName}`.trim()
                  : "Your new contact"}
              </h2>

              <p className="preview-company">
                {formData.company || "A new connection"}
              </p>

              <div className="preview-divider" />

              <div className="preview-detail">
                <Mail size={16} />
                <span>{formData.email || "Email address"}</span>
              </div>

              <div className="preview-detail">
                <Phone size={16} />
                <span>{formData.phone || "Phone number"}</span>
              </div>

              <div className="preview-detail">
                <MapPin size={16} />
                <span>{formData.address || "Address"}</span>
              </div>
            </div>

            <div className="contact-tip">
              <span className="tip-star">✳</span>

              <div>
                <strong>A small tip</strong>
                <p>
                  Add a note about where you met. Future you will
                  be glad you remembered.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default AddContact;
