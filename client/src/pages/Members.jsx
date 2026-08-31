
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
import { getStatus } from "../utils/memberStatus.js";

import {
  PageHeader,
  Card,
  Button,
  Badge,
  Field,
  Select,
  ErrorBanner,
  EmptyState,
  SkeletonPage,
  statusTone,
} from "../components/ui";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  membershipPlan: "",
  dueDate: "",
};

const Members = () => {
  const { gym, role, loading: gymLoading } = useGym();
  const { gymId } = useParams();

  const canManageMembers = ["owner", "admin", "staff"].includes(role);

  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionError, setActionError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /*
   * Load members and membership plans.
   */
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      if (!gymId) return;

      try {
        setLoading(true);
        setError("");

        const [membersRes, plansRes] = await Promise.all([
          getMembers(gymId),
          api.get(`/gyms/${gymId}/plans`),
        ]);

        if (cancelled) return;

        setMembers(membersRes.data?.members || []);
        setPlans(plansRes.data?.plans || []);
      } catch (err) {
        if (cancelled) return;

        setError(
          err.response?.data?.message ||
            "Failed to load members and plans"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [gymId]);

  /*
   * Handle form changes.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * Reset form.
   */
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setActionError("");
  };

  /*
   * Open Add Member form.
   */
  const handleAddMember = () => {
    setActionError("");
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  /*
   * Create or update member.
   *
   * Password:
   * - Allowed during creation.
   * - NEVER sent during general member updates.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setActionError("");
    setSubmitting(true);

    try {
      if (editingId) {
        /*
         * Password changes are intentionally NOT supported
         * by the general update endpoint.
         */
        const { password, ...updateData } = form;

        await updateMember(
          gymId,
          editingId,
          updateData
        );
      } else {
        /*
         * Password is optional during creation.
         *
         * The backend will hash it before saving.
         */
        await createMember(gymId, form);
      }

      /*
       * Reload members after create/update.
       */
      const membersRes = await getMembers(gymId);

      setMembers(membersRes.data?.members || []);

      resetForm();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          (editingId
            ? "Failed to update member"
            : "Failed to create member")
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Edit member.
   *
   * Password is always empty here.
   * We never retrieve or expose the existing password.
   */
  const handleEdit = (member) => {
    setActionError("");

    setEditingId(member._id);
    setShowForm(true);

    setForm({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      password: "",
      membershipPlan:
        member.membershipPlan?._id ||
        member.membershipPlan ||
        "",
      dueDate: member.dueDate
        ? member.dueDate.slice(0, 10)
        : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Delete member.
   */
  const handleDelete = async (memberId) => {
    if (deletingId) return;

    const confirmed = window.confirm(
      "Delete this member? This action cannot be undone."
    );

    if (!confirmed) return;

    setActionError("");
    setDeletingId(memberId);

    try {
      await deleteMember(gymId, memberId);

      setMembers((prev) =>
        prev.filter(
          (member) => member._id !== memberId
        )
      );

      if (editingId === memberId) {
        resetForm();
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Failed to delete member"
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * Loading state.
   */
  if (gymLoading || loading) {
    return <SkeletonPage label="Loading members" />;
  }

  /*
   * Initial loading error.
   */
  if (error) {
    return (
      <div className="p-6 md:p-10">
        <ErrorBanner>{error}</ErrorBanner>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-10">
      {/* PAGE HEADER */}

      <PageHeader
        eyebrow="Roster"
        title="Members"
        subtitle={`${gym?.name || "Gym"} · ${
          members.length
        } total`}
        right={
          canManageMembers ? (
            <Button
              type="button"
              variant="volt"
              onClick={
                showForm
                  ? resetForm
                  : handleAddMember
              }
            >
              {showForm
                ? "Close form"
                : "+ Add member"}
            </Button>
          ) : null
        }
      />

      {/* ACTION ERROR */}

      {actionError && (
        <ErrorBanner>{actionError}</ErrorBanner>
      )}

      {/* MEMBER FORM */}

      {canManageMembers && showForm && (
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
              {editingId
                ? "Edit member"
                : "Add member"}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {editingId
                ? "Update this member's information."
                : "Create a member and optionally give them member portal access."}
            </p>
          </div>

          {plans.length === 0 ? (
            <div className="rounded-xl border border-[var(--line)] p-4">
              <p className="text-sm text-[var(--muted)]">
                No membership plans are available.
                Create a plan before adding a member.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 md:grid-cols-2"
            >
              {/* NAME */}

              <Field
                label="Name"
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={submitting}
              />

              {/* EMAIL */}

              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="member@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={submitting}
              />

              {/* PASSWORD */}

              {!editingId && (
                <div className="md:col-span-2">
                  <Field
                    label="Password (optional)"
                    name="password"
                    type="password"
                    placeholder="Leave blank for no member login"
                    value={form.password}
                    onChange={handleChange}
                    disabled={submitting}
                    autoComplete="new-password"
                  />

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Set a password if this member should
                    be able to log in to the Member Portal.
                  </p>
                </div>
              )}

              {/* PHONE */}

              <Field
                label="Phone"
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
                disabled={submitting}
              />

              {/* PLAN */}

              <Select
                label="Plan"
                name="membershipPlan"
                value={form.membershipPlan}
                onChange={handleChange}
                required
                disabled={submitting}
              >
                <option value="">
                  Select plan
                </option>

                {plans.map((plan) => (
                  <option
                    key={plan._id}
                    value={plan._id}
                  >
                    {plan.name}
                  </option>
                ))}
              </Select>

              {/* DUE DATE */}

              <Field
                label="Due date"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                required
                disabled={submitting}
              />

              {/* BUTTONS */}

              <div className="flex items-end gap-3 md:col-span-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                >
                  {submitting
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                      ? "Update member"
                      : "Create member"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}

      {/* EMPTY STATE */}

      {members.length === 0 ? (
        <EmptyState
          title="No members yet"
          hint="Add your first member to start tracking attendance and payments."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => {
            const status = getStatus(member.dueDate);

            const dueDate = member.dueDate
              ? new Date(
                  member.dueDate
                ).toLocaleDateString()
              : "Not set";

            const planName =
              member.membershipPlan?.name ||
              "No plan";

            const isDeleting =
              deletingId === member._id;

            return (
              <Card
                key={member._id}
                index={index}
                className="flex flex-col justify-between p-5"
              >
                <div>
                  {/* MEMBER NAME */}

                  <Link
                    to={`/gyms/${gymId}/members/${member._id}`}
                  >
                    <h3 className="font-display text-xl font-bold text-[var(--ink)] hover:underline">
                      {member.name}
                    </h3>
                  </Link>

                  {/* EMAIL */}

                  {member.email && (
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {member.email}
                    </p>
                  )}

                  {/* PLAN */}

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Plan: {planName}
                  </p>

                  {/* DUE DATE */}

                  <p className="font-mono text-xs text-[var(--muted)]">
                    Due {dueDate}
                  </p>

                  {/* MEMBERSHIP STATUS */}

                  <div className="mt-3">
                    <Badge tone={statusTone(status)}>
                      {status}
                    </Badge>
                  </div>
                </div>

                {/* ACTIONS */}

                {canManageMembers && (
                  <div className="mt-4 flex gap-2 border-t border-[var(--line)] pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="!px-3 !py-1.5 !text-xs"
                      onClick={() =>
                        handleEdit(member)
                      }
                      disabled={isDeleting}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      className="!px-3 !py-1.5 !text-xs"
                      onClick={() =>
                        handleDelete(member._id)
                      }
                      disabled={isDeleting}
                    >
                      {isDeleting
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Members;