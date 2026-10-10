
import React, { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Search,
  BriefcaseBusiness,
  Heart,
  House,
  UserRound,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import "./Groups.css";

const defaultGroups = [
  { id: 1, name: "Family", description: "People closest to you", icon: "family" },
  { id: 2, name: "Friends", description: "Your friends and companions", icon: "friends" },
  { id: 3, name: "Work", description: "Colleagues and professional contacts", icon: "work" },
  { id: 4, name: "Other", description: "Everyone else", icon: "other" },
];

const STORAGE_KEY = "contactDiaryGroups";
const CONTACTS_KEY = "contactDiaryContacts";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    try {
      const savedGroups = localStorage.getItem(STORAGE_KEY);
      const savedContacts = localStorage.getItem(CONTACTS_KEY);

      setGroups(savedGroups ? JSON.parse(savedGroups) : defaultGroups);
      setContacts(savedContacts ? JSON.parse(savedContacts) : []);
    } catch {
      setGroups(defaultGroups);
      setContacts([]);
    }
  }, []);

  const saveGroups = (updatedGroups) => {
    setGroups(updatedGroups);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGroups));
  };

  const openCreateForm = () => {
    setEditingGroup(null);
    setForm({ name: "", description: "" });
    setShowForm(true);
  };

  const openEditForm = (group) => {
    setEditingGroup(group);
    setForm({ name: group.name, description: group.description || "" });
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    if (!name) return;

    let updatedGroups;

    if (editingGroup) {
      updatedGroups = groups.map((group) =>
        group.id === editingGroup.id
          ? { ...group, name, description: form.description.trim() }
          : group
      );
    } else {
      const duplicate = groups.some(
        (group) => group.name.toLowerCase() === name.toLowerCase()
      );

      if (duplicate) {
        alert("A group with this name already exists.");
        return;
      }

      updatedGroups = [
        ...groups,
        {
          id: Date.now(),
          name,
          description: form.description.trim(),
          icon: "other",
        },
      ];
    }

    try {
      saveGroups(updatedGroups);
      setShowForm(false);
      setEditingGroup(null);
      setForm({ name: "", description: "" });
    } catch {
      alert("Unable to save groups in browser storage.");
    }
  };

  const deleteGroup = (group) => {
    if (!window.confirm(`Delete the "${group.name}" group?`)) return;

    const updatedGroups = groups.filter((item) => item.id !== group.id);

    try {
      saveGroups(updatedGroups);
      if (selectedGroup?.id === group.id) setSelectedGroup(null);
    } catch {
      alert("Unable to delete this group.");
    }
  };

  const getGroupIcon = (icon) => {
    switch (icon) {
      case "family":
        return <House size={23} />;
      case "friends":
        return <Heart size={23} />;
      case "work":
        return <BriefcaseBusiness size={23} />;
      default:
        return <UserRound size={23} />;
    }
  };

  const getGroupContacts = (group) =>
    contacts.filter(
      (contact) =>
        contact.groupId === group.id ||
        contact.group === group.name ||
        contact.groupName === group.name
    );

  const filteredGroups = groups.filter((group) =>
    `${group.name} ${group.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="groups-page">
      <div className="groups-header">
        <div>
          <span className="groups-eyebrow">YOUR CONTACTS, ORGANIZED</span>
          <h1>Contact Groups</h1>
          <p>Bring your favorite people together, one group at a time.</p>
        </div>

        <button className="groups-add-btn" onClick={openCreateForm}>
          <Plus size={18} />
          Create Group
        </button>
      </div>

      <div className="groups-toolbar">
        <div className="groups-search">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="groups-total">
          <Users size={18} />
          <span>{groups.length} groups</span>
        </div>
      </div>

      {selectedGroup ? (
        <section className="group-detail">
          <button
            className="group-back-btn"
            onClick={() => setSelectedGroup(null)}
          >
            ← All groups
          </button>

          <div className="group-detail-heading">
            <div className="group-icon large">
              {getGroupIcon(selectedGroup.icon)}
            </div>
            <div>
              <h2>{selectedGroup.name}</h2>
              <p>{selectedGroup.description || "Your personal contact group"}</p>
            </div>
          </div>

          <h3 className="group-contacts-title">
            Contacts ({getGroupContacts(selectedGroup).length})
          </h3>

          {getGroupContacts(selectedGroup).length === 0 ? (
            <div className="groups-empty">
              <Users size={34} />
              <h3>No contacts in this group yet</h3>
              <p>
                Add a contact to this group to see them listed here. Your
                existing contacts need a matching group name or group ID.
              </p>
            </div>
          ) : (
            <div className="group-contact-list">
              {getGroupContacts(selectedGroup).map((contact) => (
                <div className="group-contact-row" key={contact.id}>
                  <div className="group-avatar">
                    {contact.initials ||
                      (contact.name || "?")
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                  </div>
                  <div>
                    <strong>
                      {contact.name ||
                        `${contact.firstName || ""} ${contact.lastName || ""}`}
                    </strong>
                    <p>{contact.email || contact.phone || "No contact details"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <div className="groups-section-heading">
            <h2>Your groups</h2>
            <span>Keep everything in its place</span>
          </div>

          {filteredGroups.length === 0 ? (
            <div className="groups-empty">
              <Users size={34} />
              <h3>No groups found</h3>
              <p>Try another search or create a new group.</p>
            </div>
          ) : (
            <div className="groups-grid">
              {filteredGroups.map((group) => (
                <article className="group-card" key={group.id}>
                  <div className="group-card-top">
                    <div className="group-icon">
                      {getGroupIcon(group.icon)}
                    </div>

                    <div className="group-card-actions">
                      <button
                        aria-label={`Edit ${group.name}`}
                        title="Edit group"
                        onClick={() => openEditForm(group)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        aria-label={`Delete ${group.name}`}
                        title="Delete group"
                        onClick={() => deleteGroup(group)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3>{group.name}</h3>
                  <p className="group-description">
                    {group.description || "A place for your contacts"}
                  </p>

                  <div className="group-card-bottom">
                    <span className="group-count">
                      <Users size={15} />
                      {getGroupContacts(group).length} contacts
                    </span>

                    <button onClick={() => setSelectedGroup(group)}>
                      View group <span>→</span>
                    </button>
                  </div>
                </article>
              ))}

              <button className="group-create-card" onClick={openCreateForm}>
                <span className="group-create-icon">
                  <Plus size={24} />
                </span>
                <strong>Create a new group</strong>
                <span>Organize your contacts your way</span>
              </button>
            </div>
          )}
        </>
      )}

      {showForm && (
        <div
          className="groups-modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="groups-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="groups-modal-header">
              <div>
                <span className="groups-eyebrow">CONTACTDIARY</span>
                <h2>{editingGroup ? "Edit group" : "Create a group"}</h2>
              </div>

              <button
                className="groups-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="group-name">Group name *</label>
              <input
                id="group-name"
                type="text"
                placeholder="e.g. College Friends"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
                autoFocus
              />

              <label htmlFor="group-description">Description</label>
              <textarea
                id="group-description"
                rows="3"
                placeholder="What is this group for?"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />

              <div className="groups-modal-actions">
                <button
                  type="button"
                  className="groups-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="groups-add-btn">
                  {editingGroup ? "Save Changes" : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;
