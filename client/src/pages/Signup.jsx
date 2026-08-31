// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Button, Field, ErrorBanner } from "../components/ui";
// import { Link } from "react-router-dom";
// const Signup = () => {
//   const navigate = useNavigate();
//   const { signup } = useAuth();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setIsSubmitting(true);

//     try {
//       await signup({ name, email, password });
//       navigate("/login");
//     } catch (error) {
//       setError(
//         error.response?.data?.message || "Unable to create account"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//       <div className="grid min-h-screen md:grid-cols-2">
//       <div className="relative hidden flex-col justify-between overflow-hidden bg-[var(--ink)] p-10 text-white md:flex">
//         <div className="gp-fade-in flex items-center gap-2">
//           <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--volt)] font-display text-xl font-extrabold text-[var(--volt-ink)]">G</span>
//           <span className="font-display text-2xl font-bold">GymPass</span>
//         </div>

//         <div className="gp-fade-in">
//           <p className="gp-eyebrow !text-white/40">Get set up</p>
//           <h1 className="mt-2 font-display text-6xl font-extrabold leading-[0.95] tracking-tight">
//             Stop chasing
//             <br />
//             due dates in a
//             <br />
//             <span className="text-[var(--volt)]">notebook.</span>
//           </h1>
//         </div>

//         <p className="gp-fade-in text-sm text-white/40">Free to start. Invite your team once you're in.</p>

//         <div className="gp-scanline-track pointer-events-none absolute inset-0 opacity-40" />
//       </div>

//       <div className="flex items-center justify-center bg-[var(--paper)] p-6">
//         <form onSubmit={handleSubmit} className="gp-stagger w-full max-w-sm space-y-5">
//           <div>
//             <p className="gp-eyebrow mb-2 md:hidden">GymPass</p>
//             <h1 className="font-display text-4xl font-bold text-[var(--ink)]">Create your account</h1>
//             <p className="mt-1 text-sm text-[var(--muted)]">Takes less than a minute.</p>
//           </div>

//           <ErrorBanner>{error}</ErrorBanner>

//           <Field label="Name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
//           <Field type="email" label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
//           <Field type="password" label="Password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

//           <Button type="submit" variant="volt" disabled={isSubmitting} className="w-full">
//             {isSubmitting ? "Creating account…" : "Sign up"}
//           </Button>

//           <p className="text-center text-sm text-[var(--muted)]">
//             Already have an account?{" "}
//             <Link to="/login" className="font-semibold text-[var(--ink)] underline decoration-[var(--volt)] decoration-2 underline-offset-4">
//               Log in
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;





import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { Button, Field, ErrorBanner } from "../components/ui";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [signupType, setSignupType] = useState("staff");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStaffSignup = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await signup({
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create account"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchSignupType = (type) => {
    setSignupType(type);
    setError("");
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">

      {/* Left panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[var(--ink)] p-10 text-white md:flex">

        <div className="gp-fade-in flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--volt)] font-display text-xl font-extrabold text-[var(--volt-ink)]">
            G
          </span>

          <span className="font-display text-2xl font-bold">
            GymPass
          </span>
        </div>

        <div className="gp-fade-in">
          <p className="gp-eyebrow !text-white/40">
            Get set up
          </p>

          <h1 className="mt-2 font-display text-6xl font-extrabold leading-[0.95] tracking-tight">
            Stop chasing
            <br />
            due dates in a
            <br />
            <span className="text-[var(--volt)]">
              notebook.
            </span>
          </h1>
        </div>

        <p className="gp-fade-in text-sm text-white/40">
          Free to start. Invite your team once you're in.
        </p>

        <div className="gp-scanline-track pointer-events-none absolute inset-0 opacity-40" />
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center bg-[var(--paper)] p-6">

        {signupType === "staff" ? (

          /* =========================
             GYM OWNER SIGNUP
          ========================== */
          <form
            onSubmit={handleStaffSignup}
            className="gp-stagger w-full max-w-sm space-y-5"
          >

            <div>
              <p className="gp-eyebrow mb-2 md:hidden">
                GymPass
              </p>

              <h1 className="font-display text-4xl font-bold text-[var(--ink)]">
                Create your account
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Takes less than a minute.
              </p>
            </div>

            {/* Account type selector */}
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--line)] p-1">

              <button
                type="button"
                onClick={() => switchSignupType("staff")}
                className="rounded-lg bg-[var(--ink)] px-3 py-2.5 text-sm font-semibold text-white"
              >
                Gym Owner
              </button>

              <button
                type="button"
                onClick={() => switchSignupType("member")}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]"
              >
                Member
              </button>

            </div>

            <ErrorBanner>
              {error}
            </ErrorBanner>

            <Field
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Field
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Field
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="volt"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting
                ? "Creating account…"
                : "Sign up"}
            </Button>

            <p className="text-center text-sm text-[var(--muted)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[var(--ink)] underline decoration-[var(--volt)] decoration-2 underline-offset-4"
              >
                Log in
              </Link>
            </p>

          </form>

        ) : (

          /* =========================
             MEMBER SIGNUP INFORMATION
          ========================== */
          <div className="gp-stagger w-full max-w-sm space-y-5">

            <div>
              <p className="gp-eyebrow mb-2 md:hidden">
                GymPass
              </p>

              <h1 className="font-display text-4xl font-bold text-[var(--ink)]">
                Member account
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Member accounts are created by the gym.
                You don't need to create one yourself.
              </p>
            </div>

            {/* Account type selector */}
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--line)] p-1">

              <button
                type="button"
                onClick={() => switchSignupType("staff")}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]"
              >
                Gym Owner
              </button>

              <button
                type="button"
                onClick={() => switchSignupType("member")}
                className="rounded-lg bg-[var(--ink)] px-3 py-2.5 text-sm font-semibold text-white"
              >
                Member
              </button>

            </div>

            <div className="rounded-2xl border border-[var(--line)] p-5">

              <p className="text-sm font-semibold text-[var(--ink)]">
                How member access works
              </p>

              <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">

                <p>
                  1. Your gym creates your member profile.
                </p>

                <p>
                  2. The gym gives you your email and
                  initial password.
                </p>

                <p>
                  3. Use those credentials to access
                  your member portal.
                </p>

              </div>
            </div>

            <Link
              to="/login"
              className="block"
            >
              <Button
                variant="volt"
                className="w-full"
              >
                Go to Login
              </Button>
            </Link>

            <p className="text-center text-sm text-[var(--muted)]">
              Want to manage a gym?{" "}
              <button
                type="button"
                onClick={() => switchSignupType("staff")}
                className="font-semibold text-[var(--ink)] underline decoration-[var(--volt)] decoration-2 underline-offset-4"
              >
                Create a gym account
              </button>
            </p>

          </div>
        )}

      </div>
    </div>
  );
};

export default Signup;