import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlans, createPlan, updatePlan, deletePlan } from "../api/plans";
import { useGym } from "../context/GymContext";
import { PageHeader, Card, Button, Badge, Field, ErrorBanner, EmptyState, SkeletonPage } from "../components/ui";

export default function Plans() {
  const { gymId } = useParams();
  const { role } = useGym();

  const canManage = role === "owner" || role === "admin";

  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({ name: "", price: "", duration: "" });

  const loadPlans = async () => {
    try {
      setError("");
      const res = await getPlans(gymId);
      setPlans(res.data.plans);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load plans");
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gymId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ name: "", price: "", duration: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      const data = { name: form.name.trim(), price: Number(form.price), duration: Number(form.duration) };

      if (editingId) {
        await updatePlan(gymId, editingId, data);
      } else {
        await createPlan(gymId, data);
      }

      resetForm();
      await loadPlans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save plan");
    }
  };

  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setShowForm(true);
    setForm({ name: plan.name, price: plan.price, duration: plan.duration });
    setError("");
  };

  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      setError("");
      await deletePlan(gymId, planId);
      await loadPlans();
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.message || "Failed to delete plan");
      }
    }
  };

  if (!loaded) return <SkeletonPage label="Loading plans" />;

  return (
    <div className="space-y-8 p-6 md:p-10">
      <PageHeader
        eyebrow="Pricing"
        title="Membership plans"
        right={canManage && <Button variant="volt" onClick={() => (showForm ? resetForm() : setShowForm(true))}>{showForm ? "Close form" : "+ New plan"}</Button>}
      />

      <ErrorBanner>{error}</ErrorBanner>

      {canManage && showForm && (
        <Card className=" p-6">
          <h2 className="mb-5 font-display text-2xl font-bold text-[var(--ink)]">{editingId ? "Edit plan" : "Create plan"}</h2>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
            <Field label="Plan name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Monthly" required />
            <Field label="Price (₹)" name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
            <Field label="Duration (days)" name="duration" type="number" min="1" value={form.duration} onChange={handleChange} required />

            <div className="flex items-end gap-3 sm:col-span-3">
              <Button type="submit" variant="primary">{editingId ? "Update plan" : "Create plan"}</Button>
              <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {plans.length === 0 ? (
        <EmptyState title="No membership plans yet" hint="Create a plan so you can start assigning it to members." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Card key={plan._id} index={i} className="flex flex-col justify-between p-5">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-2xl font-bold text-[var(--ink)]">{plan.name}</h3>
                  <Badge tone={plan.isActive ? "good" : "neutral"}>{plan.isActive ? "Active" : "Inactive"}</Badge>
                </div>
                <p className="mt-2 font-display text-3xl font-extrabold text-[var(--ink)]">₹{plan.price}</p>
                <p className="text-sm text-[var(--muted)]">{plan.duration} day cycle</p>
              </div>

              {canManage && (
                <div className="mt-4 flex gap-2 border-t border-[var(--line)] pt-4">
                  <Button variant="ghost" className="!px-3 !py-1.5 !text-xs" onClick={() => handleEdit(plan)}>Edit</Button>
                  <Button variant="danger" className="!px-3 !py-1.5 !text-xs" onClick={() => handleDelete(plan._id)}>Delete</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
