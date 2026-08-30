import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useGym } from "../context/GymContext";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../api/members.js";

import api from "../api/axios";

const Members = () => {
  const { gym, role, loading: gymLoading } = useGym();
  const { gymId } = useParams();

  const canManage =
    role === "owner" ||
    role === "admin" ||
    role === "staff";

  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    membershipPlan: "",
    dueDate: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [membersRes, plansRes] = await Promise.all([
          getMembers(gymId),
          api.get(`/gyms/${gymId}/plans`),
        ]);

        setMembers(membersRes.data.members);
        setPlans(plansRes.data.plans);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load members"
        );
      } finally {
        setLoading(false);
      }
    };

    if (gymId) fetchData();
  }, [gymId]);

  const getStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    if (due < today) {
      return "Overdue";
    }

    const threeDaysLater = new Date();
    threeDaysLater.setDate(
      threeDaysLater.getDate() + 3
    );

    if (due <= threeDaysLater) {
      return "Upcoming";
    }

    return "Current";
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await updateMember(
          gymId,
          editingId,
          form
        );

        setMembers((prev) =>
          prev.map((member) =>
            member._id === editingId
              ? response.data.member
              : member
          )
        );

        setEditingId(null);
      } else {
        const response = await createMember(
          gymId,
          form
        );

        setMembers((prev) => [
          ...prev,
          response.data.member,
        ]);
      }

      setForm({
        name: "",
        email: "",
        phone: "",
        membershipPlan: "",
        dueDate: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);

    setForm({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      membershipPlan:
        member.membershipPlan?._id ||
        member.membershipPlan ||
        "",
      dueDate: member.dueDate
        ? member.dueDate.slice(0, 10)
        : "",
    });
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm("Delete this member?")) {
      return;
    }

    try {
      await deleteMember(gymId, memberId);

      setMembers((prev) =>
        prev.filter(
          (member) => member._id !== memberId
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete member"
      );
    }
  };

  if (gymLoading || loading) {
    return <p>Loading members...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>{gym?.name} — Members</h1>

      {canManage && (
        <form onSubmit={handleSubmit}>
          <h2>
            {editingId ? "Edit Member" : "Add Member"}
          </h2>

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <select
            name="membershipPlan"
            value={form.membershipPlan}
            onChange={handleChange}
            required
          >
            <option value="">Select plan</option>

            {plans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.name}
              </option>
            ))}
          </select>

          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Update Member" : "Create Member"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  membershipPlan: "",
                  dueDate: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      <hr />

      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        members.map((member) => {
          const status = getStatus(member.dueDate);

          return (
            <div key={member._id}>
              <Link
                to={`/gyms/${gymId}/members/${member._id}`}
              >
                <h3>{member.name}</h3>
              </Link>

              <p>
                Plan:{" "}
                {member.membershipPlan?.name ||
                  "No plan"}
              </p>

              <p>
                Due:{" "}
                {new Date(
                  member.dueDate
                ).toLocaleDateString()}
              </p>

              <strong>{status}</strong>

              {canManage && (
                <>
                  <button
                    onClick={() => handleEdit(member)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(member._id)
                    }
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Members;