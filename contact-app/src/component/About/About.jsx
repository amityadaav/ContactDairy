
import React from "react";
import {
  BookUser,
  Heart,
  ShieldCheck,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./About.css";

function About() {
  const features = [
    {
      icon: <BookUser size={24} />,
      title: "Everything in one place",
      description:
        "Keep names, phone numbers, emails, addresses, and important notes organized in one simple space.",
    },
    {
      icon: <Heart size={24} />,
      title: "Remember your favorites",
      description:
        "Mark the people who matter most and find your favorite contacts whenever you need them.",
    },
    {
      icon: <Users size={24} />,
      title: "Organize your circle",
      description:
        "Create groups for family, friends, colleagues, and everyone who makes your world special.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Designed for simplicity",
      description:
        "Enjoy a clean, straightforward interface that helps you manage your contacts without unnecessary clutter.",
    },
  ];

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">
            <Sparkles size={14} />
            A LITTLE ABOUT US
          </span>

          <h1>
            Life is better
            <br />
            <span>connected.</span>
          </h1>

          <p>
            ContactDiary is your personal space for keeping the people who
            matter close. Organize your contacts, remember the little details,
            and make staying connected feel effortless.
          </p>

          <div className="about-hero-actions">
            <Link to="/contacts" className="about-primary-btn">
              Explore Contacts <ArrowRight size={17} />
            </Link>

            <Link to="/addContact" className="about-secondary-btn">
              Add a Contact
            </Link>
          </div>
        </div>

        <div className="about-visual">
          <div className="about-paper-card">
            <div className="about-paper-top">
              <span>YOUR LITTLE BLACK BOOK</span>
              <Heart size={19} />
            </div>

            <div className="about-card-heading">
              <span>01 — THE PEOPLE</span>
              <h2>Good people.</h2>
              <h2>Good memories.</h2>
            </div>

            <div className="about-person">
              <div className="about-person-avatar avatar-yellow">S</div>
              <div>
                <strong>Someone special</strong>
                <span>Always a call away</span>
              </div>
              <Heart size={17} className="about-person-heart" />
            </div>

            <div className="about-person">
              <div className="about-person-avatar avatar-green">F</div>
              <div>
                <strong>Your favorite people</strong>
                <span>Close to your heart</span>
              </div>
              <Heart size={17} className="about-person-heart" />
            </div>

            <div className="about-paper-footer">
              <span>Made for meaningful connections</span>
              <span>♥</span>
            </div>
          </div>

          <div className="about-sticker">
            <Heart size={19} fill="currentColor" />
            <span>Stay connected</span>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-label">
          <span>01</span>
          <span>OUR STORY</span>
        </div>

        <div className="about-story-content">
          <h2>
            More than names
            <br />
            on a screen.
          </h2>

          <div className="about-story-text">
            <p>
              Every contact tells a story. A friend who makes you laugh, a
              colleague who helps you grow, or a family member who is always
              there for you.
            </p>

            <p>
              ContactDiary brings your important connections together in one
              organized place. With contact groups, favorites, and personal
              notes, it helps you keep the details of your relationships close
              at hand.
            </p>

            <p>
              Because remembering people should feel personal, not complicated.
            </p>
          </div>
        </div>
      </section>

      <section className="about-features-section">
        <div className="about-section-heading">
          <span className="about-eyebrow">THOUGHTFULLY MADE</span>
          <h2>Small details. A better experience.</h2>
          <p>
            Everything you need to keep your personal address book in order.
          </p>
        </div>

        <div className="about-features-grid">
          {features.map((feature, index) => (
            <article className="about-feature-card" key={feature.title}>
              <div className="about-feature-top">
                <div className="about-feature-icon">{feature.icon}</div>
                <span>0{index + 1}</span>
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-values">
        <div className="about-values-content">
          <span className="about-eyebrow">OUR PHILOSOPHY</span>
          <h2>
            Less searching.
            <br />
            More connecting.
          </h2>
          <p>
            We believe the best tools are the ones that quietly make everyday
            life easier. ContactDiary is designed to help you spend less time
            managing information and more time staying in touch.
          </p>
        </div>

        <div className="about-values-note">
          <span className="about-note-heart">♥</span>
          <p>For the people you never want to lose touch with.</p>
          <span className="about-note-caption">YOUR CONTACTDIARY</span>
        </div>
      </section>

      <section className="about-cta">
        <div>
          <span className="about-eyebrow">YOUR PEOPLE ARE WAITING</span>
          <h2>Make room for connection.</h2>
          <p>Start building your personal address book today.</p>
        </div>

        <Link to="/add-contact" className="about-cta-btn">
          Get Started <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}

export default About;
