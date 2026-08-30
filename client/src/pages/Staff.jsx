
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGym } from "../context/GymContext";
import {
  getStaff,
  inviteStaff,
} from "../api/staff";

export default function Staff() {
  const { gymId } = useParams();
  const { gym, role } = useGym();

  const canInvite =
    role === "owner" || role === "admin";

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    email: "",
    role: "staff",
  });

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getStaff(gymId);

        setStaff(response.data.staff);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load staff"
        );
      } finally {
        setLoading(false);
      }
    };

    if (gymId) {
      loadStaff();
    }
  }, [gymId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleInvite = async (e) => {
    e.preventDefault();

    setInviteError("");
    setSuccess("");

    try {
      const response = await inviteStaff(
        gymId,
        form
      );

      setStaff((prev) => [
        ...prev,
        response.data.membership,
      ]);

      setForm({
        email: "",
        role: "staff",
      });

      setSuccess("Staff member invited successfully.");
    } catch (err) {
      if (err.response?.status === 404) {
        setInviteError(
          "No account exists with this email. They need to sign up first."
        );
      } else if (err.response?.status === 409) {
        setInviteError(
          err.response?.data?.message ||
            "This user is already a member of this gym."
        );
      } else {
        setInviteError(
          err.response?.data?.message ||
            "Failed to invite staff member."
        );
      }
    }
  };

  if (loading) {
    return <p>Loading staff...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {gym?.name} — Staff
      </h1>

      {canInvite && (
        <form
          onSubmit={handleInvite}
          className="space-y-3"
        >
          <h2 className="text-xl font-semibold">
            Invite Staff
          </h2>

          {inviteError && (
            <div className="rounded bg-red-100 p-3 text-red-700">
              {inviteError}
            </div>
          )}

          {success && (
            <div className="rounded bg-green-100 p-3 text-green-700">
              {success}
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="User email"
            value={form.email}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Invite
          </button>
        </form>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-3">
          Current Staff
        </h2>

        {staff.length === 0 ? (
          <p>No staff members found.</p>
        ) : (
          <div className="space-y-3">
            {staff.map((member) => (
              <div
                key={member._id}
                className="rounded border p-4"
              >
                <h3 className="font-semibold">
                  {member.user?.name || "Unknown"}
                </h3>

                <p>
                  Email: {member.user?.email || "—"}
                </p>

                <p>
                  Role: {member.role}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}