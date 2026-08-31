import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useGym } from "../context/GymContext";
import { getCheckIns } from "../api/checkins";
import { getMembers } from "../api/members";
import { getMembersByDueStatus } from "../api/dueStatus";
import { PageHeader, StatCard, Card, Badge, ErrorBanner, SkeletonPage, EmptyState, Button } from "../components/ui";

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

 if (gymLoading || loading) return <SkeletonPage label="Loading your dashboard" />;
  if (gymError) return <div className="p-6 md:p-10"><ErrorBanner>{gymError}</ErrorBanner></div>;
  if (error) return <div className="p-6 md:p-10"><ErrorBanner>{error}</ErrorBanner></div>;



  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysCheckIns = checkIns.filter((checkIn) => {
    const checkInDate = new Date(
      checkIn.checkedInAt || checkIn.createdAt
    );

    checkInDate.setHours(0, 0, 0, 0);

    return checkInDate.getTime() === today.getTime();
  });

  return (
   <div className="space-y-10 p-6 md:p-10">
      <PageHeader
        eyebrow={new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        title={gym?.name}
        subtitle="Here's how the floor looks right now."
        right={<Badge tone="volt">{role}</Badge>}
      />

      {/* Scoreboard */}
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard index={0} eyebrow="Today's check-ins" value={todaysCheckIns.length} to={`/gyms/${gymId}/scanner`} cta="Open scanner" />
        <StatCard index={1} eyebrow="Overdue members" value={overdueMembers.length} tone="overdue" to={`/gyms/${gymId}/overdue`} cta="View overdue" />
        <StatCard index={2} eyebrow="Total members" value={members.length} to={`/gyms/${gymId}/members`} cta="View members" />
      </section>

      {/* Today's activity */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-[var(--ink)]">Today's activity</h2>
          <Link to={`/gyms/${gymId}/scanner`} className="text-sm font-semibold text-[var(--ink)] underline decoration-[var(--volt)] decoration-2 underline-offset-4">
            Check in a member →
          </Link>
        </div>

        {todaysCheckIns.length === 0 ? (
          <EmptyState title="No check-ins yet today" hint="They'll show up here the moment someone scans in." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {todaysCheckIns.slice(0, 6).map((checkIn, i) => (
              <Card key={checkIn._id} index={i} className="p-4">
                <p className="font-semibold text-[var(--ink)]">{checkIn.member?.name || "Member"}</p>
                <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                  {new Date(checkIn.checkedInAt || checkIn.createdAt).toLocaleTimeString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 font-display text-2xl font-bold text-[var(--ink)]">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to={`/gyms/${gymId}/members`}><Button variant="primary">Manage members</Button></Link>
          <Link to={`/gyms/${gymId}/scanner`}><Button variant="volt">Open scanner</Button></Link>
          <Link to={`/gyms/${gymId}/overdue`}><Button variant="danger">View overdue</Button></Link>
          {(role === "owner" || role === "admin") && (
            <>
              <Link to={`/gyms/${gymId}/plans`}><Button variant="ghost">Manage plans</Button></Link>
              <Link to={`/gyms/${gymId}/staff`}><Button variant="ghost">Manage staff</Button></Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default GymDashboard;