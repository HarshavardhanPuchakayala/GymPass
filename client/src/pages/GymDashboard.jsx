import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useGym } from "../context/GymContext";
import { getCheckIns } from "../api/checkins";
import { getMembers } from "../api/members";
import { getMembersByDueStatus } from "../api/dueStatus";

const GymDashboard = () => {
  const { gym, role, loading: gymLoading, error: gymError } = useGym();
  const { gymId } = useParams();

  const [checkIns, setCheckIns] = useState([]);
  const [overdueMembers, setOverdueMembers] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          checkInsRes,
          overdueRes,
          membersRes,
        ] = await Promise.all([
          getCheckIns(gymId),
          getMembersByDueStatus(gymId, "overdue"),
          getMembers(gymId),
        ]);

        setCheckIns(checkInsRes.data.checkIns || []);
        setOverdueMembers(overdueRes.data.members || []);
        setMembers(membersRes.data.members || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    if (gymId) {
      loadDashboard();
    }
  }, [gymId]);

  if (gymLoading || loading) {
    return (
      <div className="p-6">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (gymError) {
    return (
      <div className="p-6">
        <div className="rounded bg-red-100 p-3 text-red-700">
          {gymError}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  // Normalize today to midnight.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Only count check-ins that happened today.
  const todaysCheckIns = checkIns.filter((checkIn) => {
    const checkInDate = new Date(
      checkIn.checkedInAt || checkIn.createdAt
    );

    checkInDate.setHours(0, 0, 0, 0);

    return checkInDate.getTime() === today.getTime();
  });

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold">
          {gym?.name}
        </h1>

        <p className="mt-1 text-gray-600">
          Welcome back. Here is your gym's activity today.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Your role:{" "}
          <span className="font-semibold capitalize">
            {role}
          </span>
        </p>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 md:grid-cols-3">

        {/* Today's check-ins */}
        <Link
          to={`/gyms/${gymId}/scanner`}
          className="rounded-lg border p-5 transition hover:shadow-md"
        >
          <p className="text-sm text-gray-500">
            Today's Check-ins
          </p>

          <p className="mt-2 text-3xl font-bold">
            {todaysCheckIns.length}
          </p>

          <p className="mt-2 text-sm text-blue-600">
            Open scanner →
          </p>
        </Link>

        {/* Overdue */}
        <Link
          to={`/gyms/${gymId}/overdue`}
          className="rounded-lg border p-5 transition hover:shadow-md"
        >
          <p className="text-sm text-gray-500">
            Overdue Members
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {overdueMembers.length}
          </p>

          <p className="mt-2 text-sm text-red-600">
            View overdue members →
          </p>
        </Link>

        {/* Total members */}
        <Link
          to={`/gyms/${gymId}/members`}
          className="rounded-lg border p-5 transition hover:shadow-md"
        >
          <p className="text-sm text-gray-500">
            Total Members
          </p>

          <p className="mt-2 text-3xl font-bold">
            {members.length}
          </p>

          <p className="mt-2 text-sm text-blue-600">
            View members →
          </p>
        </Link>
      </section>

      {/* Today's activity */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Today's Activity
          </h2>

          <Link
            to={`/gyms/${gymId}/scanner`}
            className="text-sm text-blue-600"
          >
            Check in member →
          </Link>
        </div>

        {todaysCheckIns.length === 0 ? (
          <div className="mt-4 rounded-lg border p-6">
            <p className="text-gray-600">
              No check-ins yet today.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {todaysCheckIns.slice(0, 5).map((checkIn) => (
              <div
                key={checkIn._id}
                className="rounded-lg border p-4"
              >
                <p className="font-medium">
                 {checkIn.member?.name || "Member"}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(
                    checkIn.checkedInAt ||
                      checkIn.createdAt
                  ).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-xl font-semibold">
          Quick Actions
        </h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to={`/gyms/${gymId}/members`}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Manage Members
          </Link>

          <Link
            to={`/gyms/${gymId}/scanner`}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Open Scanner
          </Link>

          <Link
            to={`/gyms/${gymId}/overdue`}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            View Overdue
          </Link>

          {(role === "owner" || role === "admin") && (
            <>
              <Link
                to={`/gyms/${gymId}/plans`}
                className="rounded border px-4 py-2"
              >
                Manage Plans
              </Link>

              <Link
                to={`/gyms/${gymId}/staff`}
                className="rounded border px-4 py-2"
              >
                Manage Staff
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default GymDashboard;