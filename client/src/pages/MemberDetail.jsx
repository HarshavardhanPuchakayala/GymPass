import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

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
      setPayments(paymentRes.data.payments || []);
      setCheckIns(checkInRes.data.checkIns || []);
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
    if (gymId && memberId) {
      loadData();
    }
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

      // Refresh member, payment history,
      // and check-in history without page reload.
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
    return (
      <div className="p-6">
        <p>Loading member details...</p>
      </div>
    );
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
    return (
      <div className="p-6">
        <p>Member not found.</p>
      </div>
    );
  }

  const status = getStatus(member.dueDate);

  return (
    <div className="p-6 space-y-8">

      {/* Error message */}
      {error && (
        <div className="rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {/* Member Information */}
      <section className="rounded border p-6">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">

          {/* Member Details */}
          <div>
            <h1 className="text-2xl font-bold">
              {member.name}
            </h1>

            <div className="mt-4 space-y-2">
              <p>
                <strong>Email:</strong>{" "}
                {member.email || "—"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {member.phone || "—"}
              </p>

              <p>
                <strong>Plan:</strong>{" "}
                {member.membershipPlan?.name || "—"}
              </p>

              <p>
                <strong>Due:</strong>{" "}
                {new Date(
                  member.dueDate
                ).toLocaleDateString()}
              </p>
            </div>

            {/* Status */}
            <span
              className={`inline-block mt-4 rounded px-3 py-1 text-sm ${
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

          {/* Record Payment */}
          {canRecordPayment && (
            <div>
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {paymentLoading
                  ? "Recording..."
                  : "Record Payment"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Member QR Code */}
      <section className="rounded border p-6">
        <h2 className="text-xl font-semibold mb-4">
          Member QR Code
        </h2>

        <div className="inline-flex flex-col items-center gap-3 rounded border bg-white p-4">
          <QRCodeSVG
            value={member._id}
            size={200}
            level="M"
          />

          <p className="text-sm text-gray-600 text-center">
            Show this QR code at the gym entrance
            for check-in.
          </p>
        </div>
      </section>

      {/* Payment History */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Payment History
        </h2>

        {payments.length === 0 ? (
          <div className="rounded border p-4">
            <p>No payments yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="rounded border p-4"
              >
                <p>
                  <strong>Amount:</strong> ₹
                  {payment.amount}
                </p>

                <p>
                  <strong>Previous due:</strong>{" "}
                  {new Date(
                    payment.previousDueDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>New due:</strong>{" "}
                  {new Date(
                    payment.newDueDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>Paid on:</strong>{" "}
                  {new Date(
                    payment.createdAt
                  ).toLocaleString()}
                </p>

                {payment.recordedBy && (
                  <p>
                    <strong>Recorded by:</strong>{" "}
                    {payment.recordedBy.name ||
                      payment.recordedBy.email}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Check-in History */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Check-In History
        </h2>

        {checkIns.length === 0 ? (
          <div className="rounded border p-4">
            <p>No check-ins yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {checkIns.map((checkIn) => (
              <div
                key={checkIn._id}
                className="rounded border p-4"
              >
                <p>
                  {new Date(
                    checkIn.checkedInAt ||
                      checkIn.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}