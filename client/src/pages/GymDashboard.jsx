import { useGym } from "../context/GymContext";

const GymDashboard = () => {
  const { gym, role, loading, error } = useGym();

  if (loading) return <p>Loading gym...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{gym?.name}</h1>
      <p>Your role: {role}</p>
    </div>
  );
};

export default GymDashboard;