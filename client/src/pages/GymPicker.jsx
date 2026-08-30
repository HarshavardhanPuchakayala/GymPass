import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

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

  if (loading) return <p>Loading gyms...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Select Gym</h1>

      {gyms.length === 0 ? (
        <p>You don't belong to any gyms yet.</p>
      ) : (
        gyms.map((item) => (
          <Link
            key={item.gym._id}
            to={`/gyms/${item.gym._id}`}
          >
            <div>
              <h2>{item.gym.name}</h2>
              <p>Role: {item.role}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default GymPicker;