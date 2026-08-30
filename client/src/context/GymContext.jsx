import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const GymContext = createContext(null);

export const GymProvider = ({ children }) => {
  const { gymId } = useParams();

  const [gym, setGym] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGym = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/gyms");

        const gyms = response.data.gyms;

        const membership = gyms.find(
          (item) => item.gym?._id === gymId
        );

        if (!membership) {
          setError("You do not have access to this gym");
          setGym(null);
          setRole(null);
          return;
        }

        setGym(membership.gym);
        setRole(membership.role);
      } catch (error) {
        console.error("Fetch gym error:", error);

        setError(
          error.response?.data?.message || "Failed to load gym"
        );

        setGym(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    if (gymId) {
      fetchGym();
    }
  }, [gymId]);

  return (
    <GymContext.Provider
      value={{
        gym,
        role,
        loading,
        error,
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);

  if (!context) {
    throw new Error("useGym must be used inside GymProvider");
  }

  return context;
};