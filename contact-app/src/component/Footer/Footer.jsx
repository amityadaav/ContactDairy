import {
  ContactRound,
  Users,
  Folder,
  Mail,
  Phone,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";
import "./Footer.css";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">
              <ContactRound size={22} strokeWidth={2.5} />
            </div>

            <span>
              Contact<span>Dairy</span>
            </span>
          </Link>

          <p className="footer-description">
            Manage all your contacts in one place.
            Save important details, organize contacts
            into groups, and stay connected with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link to="/">
                Dashboard
                <ArrowUpRight size={14} />
              </Link>
            </li>

            <li>
              <Link to="/contacts">
                All Contacts
                <ArrowUpRight size={14} />
              </Link>
            </li>

            <li>
              <Link to="/add-contact">
                Add Contact
                <ArrowUpRight size={14} />
              </Link>
            </li>

            <li>
              <Link to="/favorites">
                Favorites
                <ArrowUpRight size={14} />
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Management */}
        <div className="footer-column">
          <h3>Manage Contacts</h3>

          <ul>
            <li>
              <Link to="/groups">
                <Users size={15} />
                Contact Groups
              </Link>
            </li>

            <li>
              <Link to="/recent">
                <Folder size={15} />
                Recent Contacts
              </Link>
            </li>

            <li>
              <Link to="/profile">
                <ContactRound size={15} />
                My Profile
              </Link>
            </li>

            <li>
              <Link to="/settings">
                <ShieldCheck size={15} />
                Account Settings
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="footer-column footer-contact">
          <h3>Get in Touch</h3>

          <p className="footer-contact-description">
            Have questions or need help? Contact our support team.
          </p>

          <div className="contact-item">
            <div className="contact-icon">
              <Mail size={17} />
            </div>

            <a href="mailto:support@contacthub.com">
              support@contactDiary.com
            </a>
          </div>

          <div className="contact-item">
            <div className="contact-icon">
              <Phone size={17} />
            </div>

            <a href="tel:+919999999999">
              +91 99999 99999
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>
            © {currentYear} ContactDairy. All rights reserved.
          </p>

          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms">Terms of Service</Link>
            <span>•</span>
            <Link to="/help">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
