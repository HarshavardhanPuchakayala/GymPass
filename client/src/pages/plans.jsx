import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlans, createPlan, updatePlan, deletePlan } from "../api/plans";
import { useGym } from "../context/GymContext";

export default function Plans() {
  const { gymId } = useParams();
  const { role } = useGym();

  const canManage = role === "owner" || role === "admin";

  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
  });

  const loadPlans = async () => {
    try {
      setError("");
      const res = await getPlans(gymId);
      setPlans(res.data.plans);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load plans");
    }
  };

  useEffect(() => {
    loadPlans();
  }, [gymId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      duration: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const data = {
        name: form.name.trim(),
        price: Number(form.price),
        duration: Number(form.duration),
      };

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

    setForm({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
    });

    setError("");
  };

  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      setError("");

      await deletePlan(gymId, planId);

      await loadPlans();
    } catch (err) {
      // Important: preserve the backend's useful 409 message
      if (err.response?.status === 409) {
        setError(err.response.data.message);
      } else {
        setError(
          err.response?.data?.message || "Failed to delete plan"
        );
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Membership Plans</h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {canManage && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded border p-4 space-y-4"
        >
          <h2 className="text-lg font-semibold">
            {editingId ? "Edit Plan" : "Create Plan"}
          </h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Plan name"
            required
            className="w-full border p-2 rounded"
          />

          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="w-full border p-2 rounded"
          />

          <input
            name="duration"
            type="number"
            min="1"
            value={form.duration}
            onChange={handleChange}
            placeholder="Duration in days"
            required
            className="w-full border p-2 rounded"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              {editingId ? "Update Plan" : "Create Plan"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="space-y-4">
        {plans.length === 0 ? (
          <p>No membership plans found.</p>
        ) : (
          plans.map((plan) => (
            <div
              key={plan._id}
              className="rounded border p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  {plan.name}
                </h2>

                <p>Price: ₹{plan.price}</p>
                <p>Duration: {plan.duration} days</p>

                <span
                  className={`inline-block mt-2 rounded px-2 py-1 text-sm ${
                    plan.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {canManage && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="rounded border px-3 py-1"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}