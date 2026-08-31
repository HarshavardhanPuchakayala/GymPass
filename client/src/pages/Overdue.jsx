import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getMembersByDueStatus } from "../api/dueStatus";
import { useGym } from "../context/GymContext";
import { getDaysDifference } from "../utils/memberStatus";
import {
  PageHeader,
  Card,
  Button,
  Badge,
  ErrorBanner,
  EmptyState,
  SkeletonPage,
} from "../components/ui";

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

        const response = await getMembersByDueStatus(gymId, status);

        setMembers(response.data.members || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load members"
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
    return <SkeletonPage label="Loading follow-up list" />;
  }

  const tabs = [
    {
      key: "overdue",
      label: "Overdue",
    },
    {
      key: "upcoming",
      label: "Upcoming",
    },
  ];

  return (
    <div className="space-y-8 p-6 md:p-10">
      <PageHeader
        eyebrow="Membership"
        title="Follow-up"
        subtitle={`${gym?.name || "Gym"} — members who need attention.`}
      />

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[var(--line)]">
        {tabs.map((tab) => {
          const active = status === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatus(tab.key)}
              className={`relative pb-3 text-sm font-semibold transition-colors ${
                active
                  ? "text-[var(--ink)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {tab.label}

              {active && (
                <span
                  className={`gp-tab-underline absolute -bottom-px left-0 h-0.5 w-full ${
                    tab.key === "overdue"
                      ? "bg-[var(--overdue)]"
                      : "bg-[var(--upcoming)]"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Error */}
      <ErrorBanner>{error}</ErrorBanner>

      {/* Empty state */}
      {members.length === 0 ? (
        <EmptyState
          title={
            status === "overdue"
              ? "No overdue members"
              : "No members due soon"
          }
          hint="This list refreshes automatically as due dates change."
        />
      ) : (
        <div className="space-y-3">
          {members.map((member, i) => {
            const days = Math.abs(
              getDaysDifference(member.dueDate)
            );

            const isOverdue = status === "overdue";

            const memberUrl = `/gyms/${gymId}/members/${member._id}`;

            return (
              <Card
                key={member._id}
                index={i}
                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
              >
                {/* Member information */}
                <div>
                  <Link
                    to={memberUrl}
                    className="font-display text-xl font-bold text-[var(--ink)] hover:underline"
                  >
                    {member.name}
                  </Link>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Plan:{" "}
                    {member.membershipPlan?.name || "No plan"}
                  </p>

                  <p className="font-mono text-xs text-[var(--muted)]">
                    Due{" "}
                    {new Date(member.dueDate).toLocaleDateString()}
                  </p>

                  <div className="mt-2">
                    <Badge
                      tone={isOverdue ? "overdue" : "upcoming"}
                    >
                      {isOverdue
                        ? `${days} day${
                            days !== 1 ? "s" : ""
                          } overdue`
                        : `Due in ${days} day${
                            days !== 1 ? "s" : ""
                          }`}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* Mark contacted */}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      toggleContacted(member._id)
                    }
                    className={
                      contacted[member._id]
                        ? "!bg-[var(--good-soft)] !text-[var(--good)] !border-transparent"
                        : ""
                    }
                  >
                    {contacted[member._id]
                      ? "✓ Contacted"
                      : "Mark contacted"}
                  </Button>

                  {/* Record payment */}
                  <Link
                    to={memberUrl}
                    className="inline-block"
                  >
                    <Button
                      type="button"
                      variant="volt"
                    >
                      Record payment
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}