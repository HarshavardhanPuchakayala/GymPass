import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Field, ErrorBanner } from "../components/ui";
import { Link } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await signup({ name, email, password });
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to create account"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[var(--ink)] p-10 text-white md:flex">
        <div className="gp-fade-in flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--volt)] font-display text-xl font-extrabold text-[var(--volt-ink)]">G</span>
          <span className="font-display text-2xl font-bold">GymPass</span>
        </div>

        <div className="gp-fade-in">
          <p className="gp-eyebrow !text-white/40">Get set up</p>
          <h1 className="mt-2 font-display text-6xl font-extrabold leading-[0.95] tracking-tight">
            Stop chasing
            <br />
            due dates in a
            <br />
            <span className="text-[var(--volt)]">notebook.</span>
          </h1>
        </div>

        <p className="gp-fade-in text-sm text-white/40">Free to start. Invite your team once you're in.</p>

        <div className="gp-scanline-track pointer-events-none absolute inset-0 opacity-40" />
      </div>

      <div className="flex items-center justify-center bg-[var(--paper)] p-6">
        <form onSubmit={handleSubmit} className="gp-stagger w-full max-w-sm space-y-5">
          <div>
            <p className="gp-eyebrow mb-2 md:hidden">GymPass</p>
            <h1 className="font-display text-4xl font-bold text-[var(--ink)]">Create your account</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Takes less than a minute.</p>
          </div>

          <ErrorBanner>{error}</ErrorBanner>

          <Field label="Name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Field type="email" label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Field type="password" label="Password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <Button type="submit" variant="volt" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating account…" : "Sign up"}
          </Button>

          <p className="text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[var(--ink)] underline decoration-[var(--volt)] decoration-2 underline-offset-4">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;