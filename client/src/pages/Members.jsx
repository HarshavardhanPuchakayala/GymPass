
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
  membershipPlan: "",
  dueDate: "",
};

const Members = () => {
  const { gym, role, loading: gymLoading } = useGym();
  const { gymId } = useParams();

  /*
   * According to the GymTrack role design:
   * owner, admin and staff can manage members.
   *
   * This is only a frontend gate.
   * The backend MUST enforce the same permissions.
   */
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
   * Load members and plans.
   *
   * We intentionally keep this request together because the member
   * form requires plans.
   *
   * IMPORTANT:
   * The backend must allow the current role to GET plans if this
   * page requires plans to create/edit members.
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
   * Update form fields.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * Reset the form and close it.
   */
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setActionError("");
  };

  /*
   * Open a fresh Add Member form.
   */
  const handleAddMember = () => {
    setActionError("");
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  /*
   * Submit create/update member.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setActionError("");
    setSubmitting(true);

    try {
      if (editingId) {
        await updateMember(gymId, editingId, form);
      } else {
        await createMember(gymId, form);
      }

      /*
       * Refetch members after create/update.
       *
       * This ensures membershipPlan is populated correctly instead
       * of relying on the POST/PATCH response shape.
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
   * Start editing a member.
   */
  const handleEdit = (member) => {
    setActionError("");

    setEditingId(member._id);
    setShowForm(true);

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

    /*
     * Scroll to the form so the user immediately sees it.
     */
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
        prev.filter((member) => member._id !== memberId)
      );

      /*
       * If the deleted member was currently being edited,
       * close/reset the form.
       */
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
   * Initial page-load error.
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
      {/* ================================
          PAGE HEADER
      ================================= */}
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
                showForm ? resetForm : handleAddMember
              }
            >
              {showForm ? "Close form" : "+ Add member"}
            </Button>
          ) : null
        }
      />

      {/* ================================
          ACTION ERROR
      ================================= */}
      {actionError && (
        <ErrorBanner>{actionError}</ErrorBanner>
      )}

      {/* ================================
          MEMBER FORM
      ================================= */}
      {canManageMembers && showForm && (
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
                {editingId
                  ? "Edit member"
                  : "Add member"}
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {editingId
                  ? "Update this member's information."
                  : "Create a member and assign their membership plan."}
              </p>
            </div>
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

      {/* ================================
          EMPTY STATE
      ================================= */}
      {members.length === 0 ? (
        <EmptyState
          title="No members yet"
          hint="Add your first member to start tracking attendance and payments."
        />
      ) : (
        /* ================================
           MEMBER GRID
        ================================= */
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

                  {/* PLAN */}
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Plan: {planName}
                  </p>

                  {/* DUE DATE */}
                  <p className="font-mono text-xs text-[var(--muted)]">
                    Due {dueDate}
                  </p>

                  {/* STATUS */}
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