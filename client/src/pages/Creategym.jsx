import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { PageHeader, Card, Field, Button, ErrorBanner } from "../components/ui";

export default function CreateGym() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/gyms", form);
      const gymId = response.data.gym?._id;
      navigate(gymId ? `/gyms/${gymId}` : "/gyms");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create gym");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] px-6 py-16 md:px-10">
      <div className="mx-auto max-w-lg">
        <PageHeader
          eyebrow="Get started"
          title="Create your gym"
          subtitle="You'll be the owner — you can invite staff once it's set up."
        />

        <Card className="mt-8 p-6">
          <ErrorBanner>{error}</ErrorBanner>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field
              label="Gym name"
              name="name"
              placeholder="e.g. Iron Forge Fitness"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Field
              label="Address"
              name="address"
              placeholder="1 Main St"
              value={form.address}
              onChange={handleChange}
            />
            <Field
              label="Phone"
              name="phone"
              placeholder="555-0000"
              value={form.phone}
              onChange={handleChange}
            />

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="volt" disabled={isSubmitting}>
                {isSubmitting ? "Creating…" : "Create gym"}
              </Button>
              <Link to="/gyms">
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}