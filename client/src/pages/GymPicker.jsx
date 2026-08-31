import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Card, Badge, EmptyState, SkeletonPage, PageHeader, Button } from "../components/ui";

const GymPicker = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await api.get("/gyms");
        setGyms(response.data.gyms);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load gyms"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

   if (loading) return <SkeletonPage label="Loading your gyms" />;
  if (error) return <div className="p-6 md:p-10 max-w-lg mx-auto"><p className="text-[var(--overdue)]">{error}</p></div>;

  return (
    <div className="min-h-screen bg-[var(--paper)] px-6 py-16 md:px-10">
      <div className="mx-auto max-w-3xl">
        <PageHeader
          eyebrow="GymPass"
          title="Select a gym"
          subtitle="Choose which gym to manage."
          right={
            <Link to="/gyms/new">
              <Button variant="volt">+ Create gym</Button>
            </Link>
          }
        />

        {gyms.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="You don't belong to any gyms yet" hint="Create one, or ask an owner to invite you." />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {gyms.map((item, i) => (
              <Link key={item.gym._id} to={`/gyms/${item.gym._id}`} className="no-underline">
                <Card index={i} className="p-6">
                  <h2 className="font-display text-2xl font-bold text-[var(--ink)]">{item.gym.name}</h2>
                  <div className="mt-3"><Badge tone="volt">{item.role}</Badge></div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GymPicker;