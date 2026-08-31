
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

import { useMemberAuth } from "../context/MemberAuthContext";

import {
  PageHeader,
  Card,
  Button,
  Badge,
  SkeletonPage,
} from "../components/ui";

export default function MemberDashboard() {
  const navigate = useNavigate();

  const {
    member,
    loading,
    memberLogout,
  } = useMemberAuth();

  if (loading) {
    return (
      <SkeletonPage label="Loading membership dashboard" />
    );
  }

  if (!member) {
    return null;
  }

  const checkIns = member.checkIns || [];

  const planName =
    member.membershipPlan?.name || "No plan";

  const dueDate = member.dueDate
    ? new Date(member.dueDate).toLocaleDateString()
    : "—";

  const handleLogout = () => {
    memberLogout();

    navigate(
      `/gyms/${member.gym}/member-login`,
      { replace: true }
    );
  };

  return (
    <div className="min-h-screen space-y-8 p-6 md:p-10">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <PageHeader
          eyebrow="Member Portal"
          title={`Welcome, ${member.name}`}
          subtitle="Your membership, QR code, and gym activity."
        />

        <Button
          variant="ghost"
          type="button"
          onClick={handleLogout}
        >
          Sign out
        </Button>
      </div>

      {/* Membership summary */}
      <div className="grid gap-4 md:grid-cols-2">

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Membership plan
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-[var(--ink)]">
            {planName}
          </h2>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Due date
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-[var(--ink)]">
            {dueDate}
          </h2>
        </Card>

      </div>

      {/* QR Code */}
      <Card className="p-6">

        <PageHeader
          eyebrow="Gym Check-in"
          title="Your QR code"
          subtitle="Show this code at the gym scanner when you arrive."
        />

        <div className="mt-8 flex justify-center">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <QRCodeSVG
              value={member._id}
              size={240}
              level="M"
              includeMargin
            />
          </div>
        </div>

        <p className="mt-5 text-center font-mono text-xs text-[var(--muted)]">
          Member ID: {member._id}
        </p>

      </Card>

      {/* Check-in history */}
      <Card className="p-6">

        <div className="flex items-center justify-between gap-4">

          <div>
            <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
              Check-in history
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Your recent visits to the gym.
            </p>
          </div>

          <Badge tone="upcoming">
            {checkIns.length}{" "}
            {checkIns.length === 1
              ? "visit"
              : "visits"}
          </Badge>

        </div>

        {checkIns.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--line)] p-6 text-center">
            <p className="text-sm text-[var(--muted)]">
              You haven't checked in yet.
            </p>
          </div>
        ) : (
          <div className="mt-6 divide-y divide-[var(--line)]">

            {checkIns.map((checkIn) => {

              // checkedInAt is the actual semantic
              // check-in timestamp. createdAt is the
              // fallback for older records.
              const checkInDate =
                checkIn.checkedInAt ||
                checkIn.createdAt;

              return (
                <div
                  key={checkIn._id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >

                  <div>
                    <p className="font-semibold text-[var(--ink)]">
                      Gym check-in
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {checkInDate
                        ? new Date(
                            checkInDate
                          ).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <Badge tone="upcoming">
                    Checked in
                  </Badge>

                </div>
              );
            })}

          </div>
        )}

      </Card>

    </div>
  );
}