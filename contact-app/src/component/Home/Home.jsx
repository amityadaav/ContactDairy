
// import React, { useMemo, useState,useEffect } from "react";
// import { Search, Plus, Star, ArrowRight } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Home.css";

// const initialContacts = [
//   {
//     id: 1,
//     initials: "AS",
//     name: "Alex Smith",
//     email: "alex@example.com",
//     favorite: true,
//   },
//   {
//     id: 2,
//     initials: "JD",
//     name: "Jamie Davis",
//     email: "jamie@example.com",
//     favorite: false,
//   },
//   {
//     id: 3,
//     initials: "MR",
//     name: "Morgan Reed",
//     email: "morgan@example.com",
//     favorite: true,
//   },
// ];

// const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// const features = [
//   {
//     id: 1,
//     title: "One page per person",
//     description:
//       "Phone numbers, emails and details stay together, so you stop hunting across apps.",
//   },
//   {
//     id: 2,
//     title: "Favorites on top",
//     description:
//       "Star the people you reach for most and keep your important connections close.",
//   },
//   {
//     id: 3,
//     title: "Quick to edit",
//     description:
//       "Add a contact, fix a typo or remove an old entry in a couple of taps.",
//   },
// ];

// const Home = () => {
//   const [contacts, setContacts] = useState(initialContacts);
//   const [activeLetter, setActiveLetter] = useState("");
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();


//   const handleSearch = (e) => {
//     e.preventDefault();

//     const query = search.trim();
//     navigate(
//       query
//         ? `/contacts?search=${encodeURIComponent(query)}`
//         : "/contacts"
//     );
//   };

//   const handleLetterClick = (letter) => {
//     setActiveLetter(letter);
//     setSearch("");
//   };

//   const toggleFavorite = (id) => {
//     setContacts((previousContacts) =>
//       previousContacts.map((contact) =>
//         contact.id === id
//           ? { ...contact, favorite: !contact.favorite }
//           : contact
//       )
//     );
//   };




//   // 1. useEffect
//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/contact"
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch contacts");
//         }

//         const data = await response.json();

//         const contactList = Array.isArray(data)
//           ? data
//           : data.contacts || data.payload || [];

//         const formattedContacts = contactList.map((contact) => ({
//           ...contact,
//           id: contact._id || contact.id,
//           name:
//             `${contact.fname || ""} ${contact.lname || ""}`.trim() ||
//             contact.name ||
//             "Unnamed Contact",
//           phone: contact.Phone || contact.phone || "",
//           favorite: Boolean(contact.favorite),
//           initials:
//             `${contact.fname?.[0] || ""}${contact.lname?.[0] || ""}`.toUpperCase() ||
//             "UC",
//         }));

//         setContacts(formattedContacts);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContacts();
//   }, []);


// // 2. useMemo MUST be before any early return
//   const filteredContacts = useMemo(() => {
//     return contacts.filter((contact) => {
//       const matchesSearch = [
//         contact.name,
//         contact.email,
//         contact.phone,
//       ].some((value) =>
//         String(value || "")
//           .toLowerCase()
//           .includes(search.toLowerCase())
//       );

//       const matchesFilter =
//         filter === "all" || contact.favorite;

//       return matchesSearch && matchesFilter;
//     });
//   }, [contacts, search, filter]);

//   // 3. Other calculations
//   const favoriteCount = contacts.filter(
//     (contact) => contact.favorite
//   ).length;

//   // 4. Early returns AFTER all Hooks
//   if (loading) {
//     return <p>Loading contacts...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }






























//   return (
//     <div className="home">
//       <main className="home-main">
//         {/* HERO */}
//         <section className="hero">
//           <div className="hero-content">
//             <span className="home-eyebrow">
//               YOUR PERSONAL ADDRESS BOOK
//             </span>

//             <h1>
//               An address book that remembers{" "}
//               <span>who matters.</span>
//             </h1>

//             <p className="hero-description">
//               Save the people in your life, star your favorites, and find
//               anyone in seconds.
//             </p>

//             {/* SEARCH */}
//             <form
//               className="hero-search"
//               onSubmit={handleSearch}
//               role="search"
//             >
//               <Search size={20} aria-hidden="true" />

//               <input
//                 type="search"
//                 placeholder="Name, phone or email"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setActiveLetter("");
//                 }}
//                 aria-label="Search contacts"
//               />

//               <button type="submit">Search</button>
//             </form>

//             {search.trim() && (
//               <p className="search-feedback" aria-live="polite">
//                 {filteredContacts.length} sample{" "}
//                 {filteredContacts.length === 1 ? "contact" : "contacts"} found
//               </p>
//             )}

//             <div className="hero-actions">
//               <Link to="/addContact" className="btn-primary">
//                 <Plus size={18} aria-hidden="true" />
//                 Add contact
//               </Link>

//               <Link to="/contacts" className="text-link">
//                 Browse all
//               </Link>

//               <Link
//                 to="/contacts?filter=favorites"
//                 className="text-link"
//               >
//                 Favorites
//               </Link>
//             </div>
//           </div>

//           {/* INTERACTIVE ADDRESS BOOK */}
//           <div className="ledger" aria-label="Example contact list">
//             <span className="ledger-bookmark" aria-hidden="true" />

//             <div className="ledger-page">
//               <div className="ledger-heading">
//                 <div>
//                   <span className="ledger-kicker">YOUR DIRECTORY</span>
//                   <h2 className="ledger-title">My contacts</h2>
//                 </div>

//                 <span className="ledger-count">
//                   {filteredContacts.length}
//                 </span>
//               </div>

//               <div className="ledger-live-search">
//                 <Search size={15} aria-hidden="true" />
//                 <span>
//                   {search || (activeLetter ? `Letter ${activeLetter}` : "Find someone...")}
//                 </span>
//                 {(search || activeLetter) && (
//                   <button
//                     type="button"
//                     className="clear-search"
//                     onClick={() => {
//                       setSearch("");
//                       setActiveLetter("");
//                     }}
//                     aria-label="Clear search"
//                   >
//                     ×
//                   </button>
//                 )}
//               </div>

//               <ul className="ledger-list">
//                 {filteredContacts.length > 0 ? (
//                   filteredContacts.slice(0, 4).map((contact) => (
//                     <li key={contact.id} className="ledger-row">
//                       <span className="ledger-initials">
//                         {contact.initials}
//                       </span>

//                       <span className="ledger-text">
//                         <strong>{contact.name}</strong>
//                         <span>{contact.email}</span>
//                       </span>

//                       <button
//                         type="button"
//                         className={`ledger-star-button ${
//                           contact.favorite ? "is-favorite" : ""
//                         }`}
//                         onClick={() => toggleFavorite(contact.id)}
//                         aria-label={
//                           contact.favorite
//                             ? `Remove ${contact.name} from favorites`
//                             : `Add ${contact.name} to favorites`
//                         }
//                         aria-pressed={contact.favorite}
//                       >
//                         <Star
//                           size={17}
//                           fill={contact.favorite ? "currentColor" : "none"}
//                         />
//                       </button>
//                     </li>
//                   ))
//                 ) : (
//                   <li className="ledger-empty">
//                     <Search size={22} />
//                     <strong>No sample contacts found</strong>
//                     <span>Try another name or letter.</span>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSearch("");
//                         setActiveLetter("");
//                       }}
//                     >
//                       Clear filter
//                     </button>
//                   </li>
//                 )}
//               </ul>

//               <Link to="/contacts" className="ledger-more">
//                 Open full list <ArrowRight size={15} />
//               </Link>
//             </div>

//             {/* A–Z INDEX */}
//             <nav className="ledger-index" aria-label="Jump to letter">
//               {LETTERS.map((letter) => (
//                 <button
//                   key={letter}
//                   type="button"
//                   className={
//                     activeLetter === letter ? "is-active" : ""
//                   }
//                   onClick={() => handleLetterClick(letter)}
//                   aria-label={`Preview contacts starting with ${letter}`}
//                   aria-pressed={activeLetter === letter}
//                 >
//                   {letter}
//                 </button>
//               ))}
//             </nav>

//             <div className="ledger-note">
//               <Star size={15} fill="currentColor" />
//               <span>Keep your favorite people close.</span>
//             </div>
//           </div>
//         </section>

//         {/* FEATURES */}
//         <section className="about">
//           <div className="about-heading">
//             <span className="home-eyebrow">THOUGHTFULLY ORGANIZED</span>
//             <h2>Small tool, one job: keeping your people in order.</h2>
//           </div>

//           <dl className="about-list">
//             {features.map((feature, index) => (
//               <div className="about-item" key={feature.id}>
//                 <span className="about-number">
//                   0{index + 1}
//                 </span>

//                 <div>
//                   <dt>{feature.title}</dt>
//                   <dd>{feature.description}</dd>
//                 </div>
//               </div>
//             ))}
//           </dl>
//         </section>

//         {/* CALL TO ACTION */}
//         <section className="closing">
//           <div>
//             <span className="closing-eyebrow">A FRESH START</span>
//             <h2>Start with one name.</h2>
//             <p>Add the rest whenever you meet them.</p>
//           </div>

//           <Link to="/addContact" className="btn-butter">
//             <Plus size={18} aria-hidden="true" />
//             Add your first contact
//             <ArrowRight size={16} aria-hidden="true" />
//           </Link>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Star,
  ArrowRight,
} from "lucide-react";
import {
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import "./Home.css";

const API_URL = import.meta.env.VITE_API_URL;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const features = [
  {
    id: 1,
    title: "One page per person",
    description:
      "Phone numbers, emails and details stay together, so you stop hunting across apps.",
  },
  {
    id: 2,
    title: "Favorites on top",
    description:
      "Star the people you reach for most and keep your important connections close.",
  },
  {
    id: 3,
    title: "Quick to edit",
    description:
      "Add a contact, fix a typo or remove an old entry in a couple of taps.",
  },
];

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const navigate = useNavigate();

  // Keep login state synchronized with the application.
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

  // Fetch contacts only when the user is logged in.
  useEffect(() => {
    if (!isLoggedIn) {
      setContacts([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error(
            "VITE_API_URL is missing from your .env file."
          );
        }

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/api/contact`,
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

        if (response.status === 401 ||
            response.status === 403) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setContacts([]);
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch contacts (${response.status}).`
          );
        }

        const data = await response.json();

        const contactList = Array.isArray(data)
          ? data
          : data.contacts ||
            data.payload ||
            data.Payload ||
            [];

        const formattedContacts = contactList.map(
          (contact) => {
            const firstName =
              contact.fname ||
              contact.firstName ||
              "";

            const lastName =
              contact.lname ||
              contact.lastName ||
              "";

            const name =
              `${firstName} ${lastName}`.trim() ||
              contact.name ||
              "Unnamed Contact";

            const initials =
              `${firstName[0] || ""}${lastName[0] || ""}`
                .toUpperCase() ||
              name.slice(0, 2).toUpperCase();

            return {
              ...contact,
              id: contact._id || contact.id,
              name,
              email: contact.email || contact.Email || "",
              phone: contact.Phone || contact.phone || "",
              initials,
              favorite: Boolean(contact.favorite),
            };
          }
        );

        setContacts(formattedContacts);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Unable to load contacts."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchContacts();

    return () => controller.abort();
  }, [isLoggedIn]);

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    navigate(
      query
        ? `/contacts?search=${encodeURIComponent(query)}`
        : "/contacts"
    );
  };

  const handleLetterClick = (letter) => {
    setActiveLetter((previous) =>
      previous === letter ? "" : letter
    );
    setSearch("");
  };

  const clearFilters = () => {
    setSearch("");
    setActiveLetter("");
    setFilter("all");
  };

  const toggleFavorite = (id) => {
    setContacts((previousContacts) =>
      previousContacts.map((contact) =>
        contact.id === id
          ? {
              ...contact,
              favorite: !contact.favorite,
            }
          : contact
      )
    );
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const query = search.trim().toLowerCase();

      const matchesSearch = [
        contact.name,
        contact.email,
        contact.phone,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );

      const matchesLetter =
        !activeLetter ||
        contact.name
          .toUpperCase()
          .startsWith(activeLetter);

      const matchesFilter =
        filter === "all" || contact.favorite;

      return (
        matchesSearch &&
        matchesLetter &&
        matchesFilter
      );
    });
  }, [contacts, search, activeLetter, filter]);

  const favoriteCount = contacts.filter(
    (contact) => contact.favorite
  ).length;

  // Do not display the Home page to logged-out users.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="home-status">
        <p>Loading contacts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-status">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      <main className="home-main">
        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <span className="home-eyebrow">
              YOUR PERSONAL ADDRESS BOOK
            </span>

            <h1>
              An address book that remembers{" "}
              <span>who matters.</span>
            </h1>

            <p className="hero-description">
              Save the people in your life, star your
              favorites, and find anyone in seconds.
            </p>

            {/* SEARCH */}
            <form
              className="hero-search"
              onSubmit={handleSearch}
              role="search"
            >
              <Search size={20} aria-hidden="true" />

              <input
                type="search"
                placeholder="Name, phone or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveLetter("");
                }}
                aria-label="Search contacts"
              />

              <button type="submit">
                Search
              </button>
            </form>

            {search.trim() && (
              <p
                className="search-feedback"
                aria-live="polite"
              >
                {filteredContacts.length}{" "}
                {filteredContacts.length === 1
                  ? "contact"
                  : "contacts"}{" "}
                found
              </p>
            )}

            <div className="hero-actions">
              <Link
                to="/addContact"
                className="btn-primary"
              >
                <Plus size={18} aria-hidden="true" />
                Add contact
              </Link>

              <Link
                to="/contacts"
                className="text-link"
              >
                Browse all
              </Link>

              <Link
                to="/contacts?filter=favorites"
                className="text-link"
              >
                Favorites ({favoriteCount})
              </Link>
            </div>
          </div>

          {/* CONTACT DIRECTORY */}
          <div
            className="ledger"
            aria-label="Your contact list"
          >
            <span
              className="ledger-bookmark"
              aria-hidden="true"
            />

            <div className="ledger-page">
              <div className="ledger-heading">
                <div>
                  <span className="ledger-kicker">
                    YOUR DIRECTORY
                  </span>

                  <h2 className="ledger-title">
                    My contacts
                  </h2>
                </div>

                <span className="ledger-count">
                  {filteredContacts.length}
                </span>
              </div>

              <div className="ledger-live-search">
                <Search
                  size={15}
                  aria-hidden="true"
                />

                <span>
                  {search ||
                    (activeLetter
                      ? `Letter ${activeLetter}`
                      : filter === "all"
                      ? "Find someone..."
                      : "Favorite contacts")}
                </span>

                {(search || activeLetter ||
                  filter !== "all") && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={clearFilters}
                    aria-label="Clear filters"
                  >
                    ×
                  </button>
                )}
              </div>

              <ul className="ledger-list">
                {filteredContacts.length > 0 ? (
                  filteredContacts
                    .slice(0, 4)
                    .map((contact) => (
                      <li
                        key={contact.id}
                        className="ledger-row"
                      >
                        <span className="ledger-initials">
                          {contact.initials}
                        </span>

                        <span className="ledger-text">
                          <strong>{contact.name}</strong>
                          <span>{contact.email}</span>
                        </span>

                        <button
                          type="button"
                          className={`ledger-star-button ${
                            contact.favorite
                              ? "is-favorite"
                              : ""
                          }`}
                          onClick={() =>
                            toggleFavorite(contact.id)
                          }
                          aria-label={
                            contact.favorite
                              ? `Remove ${contact.name} from favorites`
                              : `Add ${contact.name} to favorites`
                          }
                          aria-pressed={contact.favorite}
                        >
                          <Star
                            size={17}
                            fill={
                              contact.favorite
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      </li>
                    ))
                ) : (
                  <li className="ledger-empty">
                    <Search size={22} />

                    <strong>
                      {contacts.length === 0
                        ? "No contacts yet"
                        : "No contacts found"}
                    </strong>

                    <span>
                      {contacts.length === 0
                        ? "Add your first contact to get started."
                        : "Try another name or clear your filters."}
                    </span>

                    {contacts.length === 0 ? (
                      <Link
                        to="/addContact"
                        className="text-link"
                      >
                        Add your first contact
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </button>
                    )}
                  </li>
                )}
              </ul>

              <Link
                to="/contacts"
                className="ledger-more"
              >
                Open full list{" "}
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* A–Z INDEX */}
            <nav
              className="ledger-index"
              aria-label="Filter contacts by letter"
            >
              {LETTERS.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  className={
                    activeLetter === letter
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    handleLetterClick(letter)
                  }
                  aria-label={`Show contacts starting with ${letter}`}
                  aria-pressed={
                    activeLetter === letter
                  }
                >
                  {letter}
                </button>
              ))}
            </nav>

            <div className="ledger-note">
              <Star
                size={15}
                fill="currentColor"
              />
              <span>
                Keep your favorite people close.
              </span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="about">
          <div className="about-heading">
            <span className="home-eyebrow">
              THOUGHTFULLY ORGANIZED
            </span>

            <h2>
              Small tool, one job: keeping your people
              in order.
            </h2>
          </div>

          <dl className="about-list">
            {features.map((feature, index) => (
              <div
                className="about-item"
                key={feature.id}
              >
                <span className="about-number">
                  0{index + 1}
                </span>

                <div>
                  <dt>{feature.title}</dt>
                  <dd>{feature.description}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        {/* CALL TO ACTION */}
        <section className="closing">
          <div>
            <span className="closing-eyebrow">
              A FRESH START
            </span>

            <h2>Start with one name.</h2>

            <p>
              Add the rest whenever you meet them.
            </p>
          </div>

          <Link
            to="/addContact"
            className="btn-butter"
          >
            <Plus size={18} aria-hidden="true" />
            Add your first contact
            <ArrowRight
              size={16}
              aria-hidden="true"
            />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
