import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const EMPTY_FORM = { name: "", membershipId: "", role: "member" };

export default function Users() {
  const { users, setUsers, currentUser } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const membershipId = form.membershipId.trim();

    if (!name || !membershipId) {
      setError("Enter a name and membership ID.");
      return;
    }
    const duplicateId = users.some(
      (user) => user.membershipId.toLowerCase() === membershipId.toLowerCase() && user.id !== editingUser?.id
    );
    if (duplicateId) {
      setError("That membership ID is already in use.");
      return;
    }

    const updatedUser = { name, membershipId, role: form.role };
    if (editingUser) {
      setUsers((previous) => previous.map((user) => (
        user.id === editingUser.id ? { ...user, ...updatedUser } : user
      )));
    } else {
      setUsers((previous) => [...previous, { ...updatedUser, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }]);
    }
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, membershipId: user.membershipId, role: user.role });
    setError("");
  };

  const deleteUser = (user) => {
    if (user.id === currentUser.id) {
      setError("You cannot delete the account you are currently using.");
      return;
    }
    if (window.confirm(`Delete the account for ${user.name}?`)) {
      setUsers((previous) => previous.filter((item) => item.id !== user.id));
      if (editingUser?.id === user.id) {
        setEditingUser(null);
        setForm(EMPTY_FORM);
      }
    }
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h2>User management</h2>
        </div>
        <span className="count-label">{users.length} accounts</span>
      </div>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <h3>{editingUser ? "Update user" : "Add a user"}</h3>
        <div className="form-grid">
          <div>
            <label htmlFor="user-name">Name</label>
            <input
              id="user-name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label htmlFor="membership-id">Membership ID</label>
            <input
              id="membership-id"
              value={form.membershipId}
              onChange={(event) => setForm({ ...form, membershipId: event.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="user-role">Role</label>
            <select
              id="user-role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
            >
              <option value="member">Member</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn">{editingUser ? "Save changes" : "Add user"}</button>
          {editingUser && <button type="button" className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>}
        </div>
      </form>

      <section className="list-section">
        <h3>Registered users</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Membership ID</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}{user.id === currentUser.id ? " (you)" : ""}</td>
                  <td>{user.membershipId}</td>
                  <td>{user.role === "admin" ? "Administrator" : "Member"}</td>
                  <td className="actions">
                    <button type="button" className="btn btn-small" onClick={() => startEditing(user)}>Update</button>
                    <button type="button" className="btn btn-small btn-danger" onClick={() => deleteUser(user)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}