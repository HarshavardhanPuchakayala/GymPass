import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGym } from "../context/GymContext";
import { getStaff, inviteStaff } from "../api/staff";
import { PageHeader, Card, Button, Badge, Field, Select, ErrorBanner, SuccessBanner, EmptyState, SkeletonPage } from "../components/ui";

export default function Staff() {
  const { gymId } = useParams();
  const { gym, role } = useGym();

  const canInvite = role === "owner" || role === "admin";

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ email: "", role: "staff" });

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getStaff(gymId);
        setStaff(response.data.staff);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load staff");
      } finally {
        setLoading(false);
      }
    };

    if (gymId) loadStaff();
  }, [gymId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError("");
    setSuccess("");

    try {
      const response = await inviteStaff(gymId, form);
      setStaff((prev) => [...prev, response.data.membership]);
      setForm({ email: "", role: "staff" });
      setSuccess("Staff member invited successfully.");
    } catch (err) {
      if (err.response?.status === 404) {
        setInviteError("No account exists with this email. They need to sign up first.");
      } else if (err.response?.status === 409) {
        setInviteError(err.response?.data?.message || "This user is already a member of this gym.");
      } else {
        setInviteError(err.response?.data?.message || "Failed to invite staff member.");
      }
    }
  };

  if (loading) return <SkeletonPage label="Loading staff" />;
  if (error) return <div className="p-6 md:p-10"><ErrorBanner>{error}</ErrorBanner></div>;

  return (
    <div className="space-y-8 p-6 md:p-10">
      <PageHeader eyebrow="Team" title="Staff" subtitle={gym?.name} />

      {canInvite && (
        <Card className="p-6">
          <h2 className="mb-5 font-display text-2xl font-bold text-[var(--ink)]">Invite staff</h2>

          <ErrorBanner>{inviteError}</ErrorBanner>
          <div className="mt-3"><SuccessBanner>{success}</SuccessBanner></div>

          <form onSubmit={handleInvite} className="mt-4 grid gap-4 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
            <Field label="User email" type="email" name="email" placeholder="name@example.com" value={form.email} onChange={handleChange} required />

            <Select label="Role" name="role" value={form.role} onChange={handleChange}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </Select>

            <Button type="submit" variant="volt">Invite</Button>
          </form>
        </Card>
      )}

      <section>
        <h2 className="mb-3 font-display text-2xl font-bold text-[var(--ink)]">Current staff</h2>

        {staff.length === 0 ? (
          <EmptyState title="No staff members yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((member, i) => (
              <Card key={member._id} index={i} className="p-5">
                <h3 className="font-display text-xl font-bold text-[var(--ink)]">{member.user?.name || "Unknown"}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{member.user?.email || "—"}</p>
                <div className="mt-3"><Badge tone="volt">{member.role}</Badge></div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
