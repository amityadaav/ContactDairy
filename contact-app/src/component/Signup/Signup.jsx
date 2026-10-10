
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookUser,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import "./Signup.css";

const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    Username: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.Username.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.Password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.Password !== form.ConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!API_URL) {
      setError("API URL is missing. Please configure your frontend .env file.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: form.Username.trim(),
          Email: form.Email.trim(),
          Password: form.Password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed. Please try again.");
      }

      setForm({
        Username: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
      });

      setShowSuccess(true);
    } catch (err) {
      console.error("Signup error:", err);

      setError(
        err instanceof TypeError
          ? "Unable to connect to the server. Please check your backend URL and try again."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-layout">
        <div className="signup-visual">
          <Link to="/" className="signup-brand">
            <span className="signup-brand-icon">
              <BookUser size={23} />
            </span>
            <span>ContactDiary</span>
          </Link>

          <div className="signup-visual-content">
            <span className="signup-eyebrow">
              A HOME FOR YOUR PEOPLE
            </span>

            <h1>
              Every connection
              <br />
              <span>has a story.</span>
            </h1>

            <p>
              Create your own little address book and keep the people who
              matter just a little closer.
            </p>

            <div className="signup-note">
              <div className="signup-note-icon">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <strong>Your people, all in one place.</strong>
                <span>Simple, personal, and organized.</span>
              </div>
            </div>
          </div>

          <div className="signup-visual-footer">
            <span>KEEP THE PEOPLE CLOSE.</span>
            <span>MADE WITH ♥</span>
          </div>
        </div>

        <div className="signup-form-side">
          <div className="signup-form-container">
            <div className="signup-mobile-brand">
              <BookUser size={25} />
              <span>ContactDiary</span>
            </div>

            <div className="signup-heading">
              <span className="signup-eyebrow">
                GET STARTED TODAY
              </span>
              <h2>Create your account</h2>
              <p>Start organizing your contacts in one place.</p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="signup-field">
                <label htmlFor="signup-name">Full name</label>

                <div className="signup-input-wrap">
                  <UserRound size={18} />
                  <input
                    id="signup-name"
                    type="text"
                    name="Username"
                    placeholder="Enter your full name"
                    value={form.Username}
                    onChange={handleChange}
                    autoComplete="name"
                    minLength={2}
                    required
                  />
                </div>
              </div>

              <div className="signup-field">
                <label htmlFor="signup-email">Email address</label>

                <div className="signup-input-wrap">
                  <Mail size={18} />
                  <input
                    id="signup-email"
                    type="email"
                    name="Email"
                    placeholder="you@example.com"
                    value={form.Email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="signup-field">
                <label htmlFor="signup-password">Password</label>

                <div className="signup-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    name="Password"
                    placeholder="At least 8 characters"
                    value={form.Password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="signup-field">
                <label htmlFor="signup-confirm-password">
                  Confirm password
                </label>

                <div className="signup-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="ConfirmPassword"
                    placeholder="Re-enter your password"
                    value={form.ConfirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="signup-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="signup-submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight size={18} />}
              </button>

              <p className="signup-terms">
                By creating an account, you agree to use ContactDiary
                responsibly and keep your account credentials secure.
              </p>
            </form>

            <div className="signup-login">
              Already have an account?{" "}
              <Link to="/login">Log in</Link>
            </div>
          </div>
        </div>
      </section>

      {showSuccess && (
        <div className="signup-success-overlay">
          <div
            className="signup-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-success-title"
          >
            <div className="signup-success-icon">
              <CheckCircle2 size={52} />
            </div>

            <h2 id="signup-success-title">
              Signup Successful!
            </h2>

            <p>
              Welcome to ContactDiary! Your account has been
              created successfully.
            </p>

            <button
              type="button"
              className="signup-success-button"
              onClick={() => navigate("/login")}
            >
              Continue to Login
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Signup;
