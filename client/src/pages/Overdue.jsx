
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getMembersByDueStatus } from "../api/dueStatus";
import { useGym } from "../context/GymContext";
import { getDaysDifference } from "../utils/memberStatus";

export default function Overdue() {
  const { gym } = useGym();
  const { gymId } = useParams();

  const [status, setStatus] = useState("overdue");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contacted, setContacted] = useState({});

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMembersByDueStatus(
          gymId,
          status
        );

        setMembers(response.data.members || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load members"
        );
      } finally {
        setLoading(false);
      }
    };

    if (gymId) {
      loadMembers();
    }
  }, [gymId, status]);

  const toggleContacted = (memberId) => {
    setContacted((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {gym?.name} — Membership Follow-up
        </h1>

        <p className="text-gray-600">
          Members who need attention.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setStatus("overdue")}
          className={`rounded px-4 py-2 ${
            status === "overdue"
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Overdue
        </button>

        <button
          onClick={() => setStatus("upcoming")}
          className={`rounded px-4 py-2 ${
            status === "upcoming"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Upcoming
        </button>
      </div>

      {error && (
        <div className="rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {members.length === 0 ? (
        <div className="rounded border p-6">
          <p>
            {status === "overdue"
              ? "No overdue members."
              : "No members due soon."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {members.map((member) => {
            const days = Math.abs(
              getDaysDifference(member.dueDate)
            );

            return (
              <div
                key={member._id}
                className="rounded border p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <Link
                    to={`/gyms/${gymId}/members/${member._id}`}
                    className="text-lg font-semibold"
                  >
                    {member.name}
                  </Link>

                  <p>
                    Plan:{" "}
                    {member.membershipPlan?.name ||
                      "No plan"}
                  </p>

                  <p>
                    Due:{" "}
                    {new Date(
                      member.dueDate
                    ).toLocaleDateString()}
                  </p>

                  {status === "overdue" ? (
                    <p className="font-semibold text-red-600">
                      {days} day{days !== 1 ? "s" : ""} overdue
                    </p>
                  ) : (
                    <p className="font-semibold text-yellow-600">
                      Due in {days} day{days !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      toggleContacted(member._id)
                    }
                    className={`rounded px-3 py-2 ${
                      contacted[member._id]
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200"
                    }`}
                  >
                    {contacted[member._id]
                      ? "✓ Contacted"
                      : "Mark Contacted"}
                  </button>

                  <Link
                    to={`/gyms/${gymId}/members/${member._id}`}
                    className="rounded bg-green-600 px-4 py-2 text-white"
                  >
                    Record Payment
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}