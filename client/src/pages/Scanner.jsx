import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

import { checkInMember } from "../api/checkins";
import { useGym } from "../context/GymContext";

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
          {
            fps: 10,
            qrbox: 250,
          },
          async (decodedText) => {
            if (processingRef.current) {
              return;
            }

            processingRef.current = true;

            setStatus("processing");
            setMessage("Checking member...");

            try {
              const response = await checkInMember(
                gymId,
                decodedText
              );

              if (!mountedRef.current) {
                return;
              }

              setStatus("success");
              setMessage(
                response.data.message ||
                  "Member checked in successfully."
              );
            } catch (error) {
              if (!mountedRef.current) {
                return;
              }

              setStatus("error");

              setMessage(
                error.response?.data?.message ||
                  "Check-in failed."
              );
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
          () => {
            // Ignore continuous scanner errors
          }
        );
      } catch (error) {
        if (!mountedRef.current) {
          return;
        }

        setStatus("error");

        setMessage(
          "Unable to start camera. Please allow camera access and try again."
        );
      }
    };

    startScanner();

    return () => {
      mountedRef.current = false;
      processingRef.current = true;

      const stopScanner = async () => {
        try {
          if (scanner.isScanning) {
            await scanner.stop();
          }

          scanner.clear();
        } catch (error) {
          console.error(
            "Scanner cleanup error:",
            error
          );
        }
      };

      stopScanner();
    };
  }, [gymId]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {gym?.name} — Check-In Scanner
        </h1>

        <p className="text-gray-600">
          Scan a member's QR code to record their visit.
        </p>
      </div>

      {message && (
        <div
          className={`rounded p-4 ${
            status === "success"
              ? "bg-green-100 text-green-700"
              : status === "error"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="max-w-md rounded border bg-white p-4">
        <div id="reader" />
      </div>

      <p className="text-sm text-gray-500">
        Point the camera at the member's QR code.
      </p>
    </div>
  );
}