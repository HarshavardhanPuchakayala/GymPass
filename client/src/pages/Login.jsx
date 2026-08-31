import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Field, ErrorBanner } from "../components/ui";
import { Link } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/gyms");
    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid email or password"
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
          <p className="gp-eyebrow !text-white/40">Run your floor</p>
          <h1 className="mt-2 font-display text-6xl font-extrabold leading-[0.95] tracking-tight">
            Every rep,
            <br />
            every payment,
            <br />
            <span className="text-[var(--volt)]">tracked.</span>
          </h1>
        </div>

        <p className="gp-fade-in text-sm text-white/40">Membership, attendance, and payments — in one place.</p>

        <div className="gp-scanline-track pointer-events-none absolute inset-0 opacity-40" />
      </div>

  
      <div className="flex items-center justify-center bg-[var(--paper)] p-6">
        <form onSubmit={handleSubmit} className="gp-stagger w-full max-w-sm space-y-5">
          <div>
            <p className="gp-eyebrow mb-2 md:hidden">GymPass</p>
            <h1 className="font-display text-4xl font-bold text-[var(--ink)]">Welcome back</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Log in to manage your gym.</p>
          </div>

          <ErrorBanner>{error}</ErrorBanner>

          <Field type="email" label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Field type="password" label="Password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <Button type="submit" variant="volt" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Logging in…" : "Log in"}
          </Button>

          <p className="text-center text-sm text-[var(--muted)]">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-[var(--ink)] underline decoration-[var(--volt)] decoration-2 underline-offset-4">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;




// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";
// import { Button, Field, ErrorBanner } from "../components/ui";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [loginType, setLoginType] = useState("staff");

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [gymId, setGymId] = useState("");

//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleStaffLogin = async (e) => {
//     e.preventDefault();

//     setError("");
//     setIsSubmitting(true);

//     try {
//       await login({ email, password });
//       navigate("/gyms");
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Invalid email or password"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleMemberContinue = (e) => {
//     e.preventDefault();

//     setError("");

//     if (!gymId.trim()) {
//       setError("Please enter your gym ID.");
//       return;
//     }

//     navigate(
//       `/gyms/${gymId.trim()}/member-login`
//     );
//   };

//   const switchLoginType = (type) => {
//     setLoginType(type);
//     setError("");
//   };

//   return (
//     <div className="grid min-h-screen md:grid-cols-2">

//       {/* Left panel */}
//       <div className="relative hidden flex-col justify-between overflow-hidden bg-[var(--ink)] p-10 text-white md:flex">

//         <div className="gp-fade-in flex items-center gap-2">
//           <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--volt)] font-display text-xl font-extrabold text-[var(--volt-ink)]">
//             G
//           </span>

//           <span className="font-display text-2xl font-bold">
//             GymPass
//           </span>
//         </div>

//         <div className="gp-fade-in">
//           <p className="gp-eyebrow !text-white/40">
//             Run your floor
//           </p>

//           <h1 className="mt-2 font-display text-6xl font-extrabold leading-[0.95] tracking-tight">
//             Every rep,
//             <br />
//             every payment,
//             <br />
//             <span className="text-[var(--volt)]">
//               tracked.
//             </span>
//           </h1>
//         </div>

//         <p className="gp-fade-in text-sm text-white/40">
//           Membership, attendance, and payments — in one place.
//         </p>

//         <div className="gp-scanline-track pointer-events-none absolute inset-0 opacity-40" />
//       </div>

//       {/* Right panel */}
//       <div className="flex items-center justify-center bg-[var(--paper)] p-6">

//         {loginType === "staff" ? (

//           /* =========================
//              STAFF LOGIN
//           ========================== */
//           <form
//             onSubmit={handleStaffLogin}
//             className="gp-stagger w-full max-w-sm space-y-5"
//           >

//             <div>
//               <p className="gp-eyebrow mb-2 md:hidden">
//                 GymPass
//               </p>

//               <h1 className="font-display text-4xl font-bold text-[var(--ink)]">
//                 Welcome back
//               </h1>

//               <p className="mt-1 text-sm text-[var(--muted)]">
//                 Log in to manage your gym.
//               </p>
//             </div>

//             {/* Account type selector */}
//             <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--line)] p-1">

//               <button
//                 type="button"
//                 onClick={() => switchLoginType("staff")}
//                 className="rounded-lg bg-[var(--ink)] px-3 py-2.5 text-sm font-semibold text-white"
//               >
//                 Gym Owner / Staff
//               </button>

//               <button
//                 type="button"
//                 onClick={() => switchLoginType("member")}
//                 className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]"
//               >
//                 Member
//               </button>

//             </div>

//             <ErrorBanner>
//               {error}
//             </ErrorBanner>

//             <Field
//               type="email"
//               label="Email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <Field
//               type="password"
//               label="Password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             <Button
//               type="submit"
//               variant="volt"
//               disabled={isSubmitting}
//               className="w-full"
//             >
//               {isSubmitting
//                 ? "Logging in…"
//                 : "Log in"}
//             </Button>

//             <p className="text-center text-sm text-[var(--muted)]">
//               New here?{" "}
//               <Link
//                 to="/signup"
//                 className="font-semibold text-[var(--ink)] underline decoration-[var(--volt)] decoration-2 underline-offset-4"
//               >
//                 Create an account
//               </Link>
//             </p>

//           </form>

//         ) : (

//           /* =========================
//              MEMBER LOGIN SELECTION
//           ========================== */
//           <form
//             onSubmit={handleMemberContinue}
//             className="gp-stagger w-full max-w-sm space-y-5"
//           >

//             <div>
//               <p className="gp-eyebrow mb-2 md:hidden">
//                 GymPass
//               </p>

//               <h1 className="font-display text-4xl font-bold text-[var(--ink)]">
//                 Member login
//               </h1>

//               <p className="mt-1 text-sm text-[var(--muted)]">
//                 Enter your gym ID to continue to your member portal.
//               </p>
//             </div>

//             {/* Account type selector */}
//             <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--line)] p-1">

//               <button
//                 type="button"
//                 onClick={() => switchLoginType("staff")}
//                 className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]"
//               >
//                 Gym Owner / Staff
//               </button>

//               <button
//                 type="button"
//                 onClick={() => switchLoginType("member")}
//                 className="rounded-lg bg-[var(--ink)] px-3 py-2.5 text-sm font-semibold text-white"
//               >
//                 Member
//               </button>

//             </div>

//             <ErrorBanner>
//               {error}
//             </ErrorBanner>

//             <Field
//               label="Gym ID"
//               placeholder="Enter your gym ID"
//               value={gymId}
//               onChange={(e) => setGymId(e.target.value)}
//               required
//             />

//             <p className="text-xs leading-relaxed text-[var(--muted)]">
//               Your gym can provide your Gym ID or a
//               direct member login link.
//             </p>

//             <Button
//               type="submit"
//               variant="volt"
//               className="w-full"
//             >
//               Continue as Member
//             </Button>

//             <p className="text-center text-sm text-[var(--muted)]">
//               Don't have member credentials?
//               <br />
//               Ask your gym staff to create your member account.
//             </p>

//             <p className="text-center text-sm text-[var(--muted)]">
//               Need a gym account?{" "}
//               <Link
//                 to="/signup"
//                 className="font-semibold text-[var(--ink)] underline decoration-[var(--volt)] decoration-2 underline-offset-4"
//               >
//                 Sign up
//               </Link>
//             </p>

//           </form>
//         )}

//       </div>
//     </div>
//   );
// };

// export default Login;