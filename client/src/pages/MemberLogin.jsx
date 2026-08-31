
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMemberAuth } from "../context/MemberAuthContext";
import {
  PageHeader,
  Card,
  Button,
  ErrorBanner,
} from "../components/ui";

export default function MemberLogin() {
  const { gymId } = useParams();
  const navigate = useNavigate();

  const { memberLogin } = useMemberAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await memberLogin(gymId, {
        email: email.trim().toLowerCase(),
        password,
      });

      navigate(`/gyms/${gymId}/my-profile`, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-md">
        <PageHeader
          eyebrow="Member Portal"
          title="Welcome back"
          subtitle="Sign in to access your membership dashboard."
        />

        <Card className="mt-8 p-6">
          <ErrorBanner>{error}</ErrorBanner>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="member-email"
                className="mb-2 block text-sm font-semibold text-[var(--ink)]"
              >
                Email
              </label>

              <input
                id="member-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--ink)]"
              />
            </div>

            <div>
              <label
                htmlFor="member-password"
                className="mb-2 block text-sm font-semibold text-[var(--ink)]"
              >
                Password
              </label>

              <input
                id="member-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--ink)]"
              />
            </div>

            <Button
              type="submit"
              variant="volt"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}