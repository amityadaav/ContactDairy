
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookUser,
  Mail,
  LockKeyhole,
  Eye,
  CheckCircle2,
  EyeOff,
  ArrowRight,
  Heart,
  ShieldCheck,
} from "lucide-react";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    Email: location.state?.Email || "",
    Password: "",
    rememberMe: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.Email.trim() || !form.Password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!API_URL) {
      setError("API URL is missing. Please configure your frontend .env file.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: form.Email.trim(),
          Password: form.Password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Extract the user object from the backend response.
      const loggedInUser =
        data.user || data.login || data.Payload || data.User;

      if (loggedInUser) {
        localStorage.setItem("user", JSON.stringify(loggedInUser));
      }

      // Preserve the existing authentication flow.
      localStorage.setItem("isLoggedIn", "true");

      window.dispatchEvent(new Event("auth-change"));

      setShowSuccess(true);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err instanceof TypeError
          ? "Unable to connect to the server. Check your backend URL and try again."
          : err.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-layout">
        <aside className="login-visual">
          <Link to="/" className="login-brand">
            <span className="login-brand-icon">
              <BookUser size={23} />
            </span>
            <span>ContactDiary</span>
          </Link>

          <div className="login-visual-content">
            <span className="login-eyebrow">
              GOOD TO HAVE YOU BACK
            </span>

            <h1>
              Your people.
              <br />
              <span>Your memories.</span>
            </h1>

            <p>
              Pick up where you left off. Your personal address book is
              ready whenever you need it.
            </p>

            <div className="login-quote-card">
              <Heart size={22} />
              <p>
                "The most meaningful connections are the ones we remember
                to nurture."
              </p>
              <span>A LITTLE REMINDER FROM CONTACTDIARY</span>
            </div>
          </div>

          <div className="login-visual-footer">
            <span>KEEP THE PEOPLE CLOSE.</span>
            <span>MADE WITH ♥</span>
          </div>
        </aside>

        <section className="login-form-side">
          <div className="login-form-container">
            <div className="login-mobile-brand">
              <BookUser size={25} />
              <span>ContactDiary</span>
            </div>

            <div className="login-heading">
              <span className="login-eyebrow">WELCOME BACK</span>
              <h2>Sign in to your account</h2>
              <p>Enter your details to access your contacts.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="login-email">Email address</label>

                <div className="login-input-wrap">
                  <Mail size={18} />

                  <input
                    id="login-email"
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

              <div className="login-field">
                <div className="login-password-label">
                  <label htmlFor="login-password">Password</label>
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>

                <div className="login-input-wrap">
                  <LockKeyhole size={18} />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="Password"
                    placeholder="Enter your password"
                    value={form.Password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
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

              <label className="login-remember">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>

              {error && (
                <p className="login-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>

              <div className="login-security-note">
                <ShieldCheck size={17} />
                <span>
                  Your account details should always stay private.
                </span>
              </div>
            </form>

            <div className="login-signup">
              Don't have an account?{" "}
              <Link to="/signup">Create one</Link>
            </div>
          </div>
        </section>
      </section>

      {showSuccess && (
        <div className="signup-success-overlay">
          <div
            className="signup-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-success-title"
          >
            <div className="signup-success-icon">
              <CheckCircle2 size={52} />
            </div>

            <h2 id="login-success-title">
              Login Successful!
            </h2>

            <p>
              Welcome back! You have successfully logged into ContactDiary.
            </p>

            <button
              type="button"
              className="signup-success-button"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Login;
