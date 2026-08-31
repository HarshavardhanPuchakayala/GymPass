import { Link } from "react-router-dom";
import { Button } from "../components/ui";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--ink)] px-6 py-16 text-center text-white">
      <div className="gp-scanline-track pointer-events-none absolute inset-0 opacity-30" />

      {/* Floating "missed scan" badge */}
      <div className="gp-float gp-reticle relative mb-8 grid h-24 w-24 place-items-center rounded-2xl border-2 border-[var(--volt)]/70">
        <span className="font-display text-4xl font-extrabold text-[var(--volt)]">?</span>
        {["top-2 left-2 border-t-2 border-l-2", "top-2 right-2 border-t-2 border-r-2", "bottom-2 left-2 border-b-2 border-l-2", "bottom-2 right-2 border-b-2 border-r-2"].map(
          (pos, i) => (
            <span key={i} className={`pointer-events-none absolute h-4 w-4 rounded-sm border-[var(--volt)] ${pos}`} />
          )
        )}
      </div>

      <p className="gp-eyebrow gp-fade-in !text-white/40">Error 404</p>

      <h1 className="gp-fade-in mt-3 font-display text-7xl font-extrabold leading-none tracking-tight sm:text-8xl">
        NO <span className="text-[var(--volt)]">SCAN</span> FOUND
      </h1>

      <p className="gp-fade-in mt-4 max-w-sm text-sm text-white/60">
        This page skipped leg day — it isn't part of the routine. Check the
        link, or head back to somewhere real.
      </p>

      <div className="gp-fade-in mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/gyms">
          <Button variant="volt">Back to my gyms</Button>
        </Link>
        <Link to="/login">
          <Button variant="ghost" className="!border-white/25 !text-white hover:!bg-white/10">
            Log in
          </Button>
        </Link>
      </div>
    </div>
  );
}