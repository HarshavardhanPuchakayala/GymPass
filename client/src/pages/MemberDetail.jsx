
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getMember } from "../api/members";
import {
  getPayments,
  recordPayment,
} from "../api/payments";
import { getCheckIns } from "../api/checkins";
import { useGym } from "../context/GymContext";
import { getStatus } from "../utils/memberStatus.js";

export default function MemberDetail() {
  const { gymId, memberId } = useParams();
  const { role } = useGym();

  const canRecordPayment =
    role === "owner" ||
    role === "admin" ||
    role === "staff";

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

      const [memberRes, paymentRes, checkInRes] =
        await Promise.all([
          getMember(gymId, memberId),
          getPayments(gymId, memberId),
          getCheckIns(gymId, memberId),
        ]);

      setMember(memberRes.data.member);
      setPayments(paymentRes.data.payments);
      setCheckIns(checkInRes.data.checkIns);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load member details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [gymId, memberId]);

  const handlePayment = async () => {
    if (
      !window.confirm(
        "Record payment for this member?"
      )
    ) {
      return;
    }

    try {
      setPaymentLoading(true);
      setError("");

      await recordPayment(gymId, memberId);

      // Refresh member, payments and check-ins
      // without a full page reload.
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to record payment"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (error && !member) {
    return (
      <div className="p-6">
        <div className="rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!member) {
    return <p className="p-6">Member not found.</p>;
  }

  const status = getStatus(member.dueDate);

  return (
    <div className="p-6 space-y-8">

      {error && (
        <div className="rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {/* Member information */}
      <section>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              {member.name}
            </h1>

            <p>
              Email: {member.email || "—"}
            </p>

            <p>
              Phone: {member.phone || "—"}
            </p>

            <p>
              Plan:{" "}
              {member.membershipPlan?.name || "—"}
            </p>

            <p>
              Due:{" "}
              {new Date(
                member.dueDate
              ).toLocaleDateString()}
            </p>

            <span
              className={`inline-block mt-2 rounded px-3 py-1 text-sm ${
                status === "overdue"
                  ? "bg-red-100 text-red-700"
                  : status === "upcoming"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {status}
            </span>
          </div>

          {canRecordPayment && (
            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {paymentLoading
                ? "Recording..."
                : "Record Payment"}
            </button>
          )}
        </div>
      </section>

      {/* Payment history */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Payment History
        </h2>

        {payments.length === 0 ? (
          <p>No payments yet.</p>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="rounded border p-4"
              >
                <p>
                  Amount: ₹{payment.amount}
                </p>

                <p>
                  Previous due:{" "}
                  {new Date(
                    payment.previousDueDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  New due:{" "}
                  {new Date(
                    payment.newDueDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  Paid on:{" "}
                  {new Date(
                    payment.createdAt
                  ).toLocaleString()}
                </p>

                {payment.recordedBy && (
                  <p>
                    Recorded by:{" "}
                    {payment.recordedBy.name ||
                      payment.recordedBy.email}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Check-in history */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Check-In History
        </h2>

        {checkIns.length === 0 ? (
          <p>No check-ins yet.</p>
        ) : (
          <div className="space-y-3">
            {checkIns.map((checkIn) => (
              <div
                key={checkIn._id}
                className="rounded border p-4"
              >
                {new Date(
                  checkIn.checkedInAt ||
                    checkIn.createdAt
                ).toLocaleString()}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}