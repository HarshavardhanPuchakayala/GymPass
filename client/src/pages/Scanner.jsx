import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

import { checkInMember } from "../api/checkins";
import { useGym } from "../context/GymContext";
import { PageHeader } from "../components/ui";

export default function Scanner() {
  const { gym } = useGym();
  const { gymId } = useParams();

  const scannerRef = useRef(null);
  const processingRef = useRef(false);
  const mountedRef = useRef(true);

  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    mountedRef.current = true;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            if (processingRef.current) return;
            processingRef.current = true;

            setStatus("processing");
            setMessage("Checking member...");

            try {
              const response = await checkInMember(gymId, decodedText);
              if (!mountedRef.current) return;
              setStatus("success");
              setMessage(response.data.message || "Member checked in successfully.");
            } catch (error) {
              if (!mountedRef.current) return;
              setStatus("error");
              setMessage(error.response?.data?.message || "Check-in failed.");
            } finally {
              if (mountedRef.current) {
                setTimeout(() => {
                  processingRef.current = false;
                  setStatus("");
                  setMessage("");
                }, 2000);
              }
            }
          },
          () => {}
        );
      } catch (error) {
        if (!mountedRef.current) return;
        setStatus("error");
        setMessage("Unable to start camera. Please allow camera access and try again.");
      }
    };

    startScanner();

    return () => {
      mountedRef.current = false;
      processingRef.current = true;

      const stopScanner = async () => {
        try {
          if (scanner.isScanning) await scanner.stop();
          scanner.clear();
        } catch (error) {
          console.error("Scanner cleanup error:", error);
        }
      };

      stopScanner();
    };
  }, [gymId]);

  const statusStyles = {
    success: "bg-[var(--good-soft)] text-[var(--good)] border-[var(--good)]/30",
    error: "bg-[var(--overdue-soft)] text-[var(--overdue)] border-[var(--overdue)]/30",
    processing: "bg-[var(--upcoming-soft)] text-[var(--upcoming)] border-[var(--upcoming)]/30",
  };

  return (
    <div className="min-h-screen space-y-8 bg-[var(--ink)] p-6 text-white md:p-10">
      <PageHeader
        tone="dark"
        eyebrow="Front desk"
        title={`${gym?.name || ""} — Check-in`}
        subtitle="Point the camera at the member's QR code."
      />

      <div className="mx-auto max-w-md">
        {/* Reticle frame */}
        <div className="gp-reticle gp-scanline-track relative mx-auto aspect-square w-full overflow-hidden rounded-3xl border-2 border-[var(--volt)]/70 bg-black">
          <div id="reader" className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />

          {/* corner marks */}
          {["top-3 left-3 border-t-2 border-l-2", "top-3 right-3 border-t-2 border-r-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map(
            (pos, i) => (
              <span key={i} className={`pointer-events-none absolute h-6 w-6 rounded-sm border-[var(--volt)] ${pos}`} />
            )
          )}
        </div>

        {message && (
          <div className={`gp-pop mt-6 rounded-xl border p-4 text-center text-sm font-semibold ${statusStyles[status] || "bg-white/10 text-white"}`}>
            {message}
          </div>
        )}

        {!message && (
          <p className="mt-6 text-center font-mono text-xs uppercase tracking-widest text-white/40">
            Awaiting scan…
          </p>
        )}
      </div>
    </div>
  );
}
