import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import { getMember } from "../api/members";
import { getPayments, recordPayment } from "../api/payments";
import { getCheckIns } from "../api/checkins";
import { useGym } from "../context/GymContext";
import { getStatus } from "../utils/memberStatus.js";
import { Card, Button, Badge, ErrorBanner, EmptyState, SkeletonPage, statusTone } from "../components/ui";

export default function MemberDetail() {
  const { gymId, memberId } = useParams();
  const { role } = useGym();

  const canRecordPayment = role === "owner" || role === "admin" || role === "staff";

  const [member, setMember] = useState(null);
  const [payments, setPayments] = useState([]);
  const [checkIns, setCheckIns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [memberRes, paymentRes, checkInRes] = await Promise.all([
        getMember(gymId, memberId),
        getPayments(gymId, memberId),
        getCheckIns(gymId, memberId),
      ]);

      setMember(memberRes.data.member);
      setPayments(paymentRes.data.payments || []);
      setCheckIns(checkInRes.data.checkIns || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load member details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gymId && memberId) loadData();
  }, [gymId, memberId]);

  const handlePayment = async () => {
    if (!window.confirm("Record payment for this member?")) return;

    try {
      setPaymentLoading(true);
      setError("");
      await recordPayment(gymId, memberId);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <SkeletonPage label="Loading member" />;
  if (error && !member) return <div className="p-6 md:p-10"><ErrorBanner>{error}</ErrorBanner></div>;
  if (!member) return <div className="p-6 md:p-10"><EmptyState title="Member not found" /></div>;

  const status = getStatus(member.dueDate);

  return (
    <div className="space-y-8 p-6 md:p-10">
      <ErrorBanner>{error}</ErrorBanner>

      {/* Profile + QR */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="gp-eyebrow mb-1">Member</p>
              <h1 className="font-display text-4xl font-bold leading-none text-[var(--ink)]">{member.name}</h1>

              <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                <p><span className="text-[var(--muted)]">Email</span><br />{member.email || "—"}</p>
                <p><span className="text-[var(--muted)]">Phone</span><br />{member.phone || "—"}</p>
                <p><span className="text-[var(--muted)]">Plan</span><br />{member.membershipPlan?.name || "—"}</p>
                <p><span className="text-[var(--muted)]">Due</span><br />{new Date(member.dueDate).toLocaleDateString()}</p>
              </div>

              <div className="mt-4"><Badge tone={statusTone(status)}>{status}</Badge></div>
            </div>

            {canRecordPayment && (
              <Button variant="volt" onClick={handlePayment} disabled={paymentLoading}>
                {paymentLoading ? "Recording…" : "Record payment"}
              </Button>
            )}
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="gp-eyebrow">Entry pass</p>
          <div className=" rounded-xl border border-[var(--line)] bg-white p-4">
            <QRCodeSVG value={member._id} size={168} level="M" />
          </div>
          <p className="text-xs text-[var(--muted)]">Show this at the gym entrance to check in.</p>
        </Card>
      </div>

      {/* Payment history */}
      <section>
        <h2 className="mb-3 font-display text-2xl font-bold text-[var(--ink)]">Payment history</h2>

        {payments.length === 0 ? (
          <EmptyState title="No payments yet" />
        ) : (
          <div className="space-y-3">
            {payments.map((payment, i) => (
              <Card key={payment._id} index={i} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-2xl font-bold text-[var(--good)]">₹{payment.amount}</p>
                  <p className="font-mono text-xs text-[var(--muted)]">{new Date(payment.createdAt).toLocaleString()}</p>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {new Date(payment.previousDueDate).toLocaleDateString()} → {new Date(payment.newDueDate).toLocaleDateString()}
                </p>
                {payment.recordedBy && (
                  <p className="mt-1 text-xs text-[var(--muted)]">Recorded by {payment.recordedBy.name || payment.recordedBy.email}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Check-in history */}
      <section>
        <h2 className="mb-3 font-display text-2xl font-bold text-[var(--ink)]">Check-in history</h2>

        {checkIns.length === 0 ? (
          <EmptyState title="No check-ins yet" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {checkIns.map((checkIn) => (
              <span key={checkIn._id} className="gp-pop rounded-full border border-[var(--line)] bg-white px-3 py-1.5 font-mono text-xs text-[var(--ink)]">
                {new Date(checkIn.checkedInAt || checkIn.createdAt).toLocaleString()}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
