import { useState } from "react";
import { NavLink, Outlet, useParams, useNavigate, Link } from "react-router-dom";

import { useGym } from "../context/GymContext";
import { useAuth } from "../context/AuthContext";
import { IconGrid, IconUsers, IconScan, IconClock, IconTag, IconStaff, IconLogout } from "../components/icons";

const NAV = [
  { to: "", label: "Dashboard", icon: IconGrid, end: true },
  { to: "members", label: "Members", icon: IconUsers },
  { to: "scanner", label: "Scanner", icon: IconScan },
  { to: "overdue", label: "Follow-up", icon: IconClock },
  { to: "plans", label: "Plans", icon: IconTag, roles: ["owner", "admin"] },
  { to: "staff", label: "Staff", icon: IconStaff, roles: ["owner", "admin"] },
];

export default function GymLayout() {
  const { gym, role } = useGym();
  const { gymId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  const items = NAV.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <div className="min-h-screen bg-[var(--paper)] md:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[var(--ink)] px-5 py-7 text-white md:flex">
        <Link to="/gyms" className="mb-10 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--volt)] font-display text-lg font-extrabold text-[var(--volt-ink)]">G</span>
          <span className="font-display text-xl font-bold tracking-tight">GymPass</span>
        </Link>

        <p className="gp-eyebrow !text-white/40">Current gym</p>
        <p className="mb-8 truncate font-display text-2xl font-bold leading-tight">{gym?.name || "—"}</p>

        <nav className="flex-1 space-y-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to || "."}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-white/10 text-[var(--volt)]" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="text-xs text-white/40">Signed in as</p>
          <p className="mb-3 text-sm font-semibold capitalize">{role}</p>
          <button
            onClick={handleLogout}
            className="gp-btn flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
          >
            <IconLogout /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--ink)] px-4 py-3 text-white md:hidden">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--volt)] font-display text-base font-extrabold text-[var(--volt-ink)]">G</span>
          <span className="font-display text-lg font-bold">{gym?.name || "GymPass"}</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md border border-white/20 px-3 py-1.5 text-sm"
          aria-expanded={mobileOpen}
        >
          Menu
        </button>
      </header>

      {mobileOpen && (
        <nav className="gp-fade-in flex flex-wrap gap-2 border-b border-[var(--line)] bg-[var(--ink-2)] px-4 py-3 md:hidden">
          {items.map(({ to, label, end }) => (
            <NavLink
              key={label}
              to={to || "."}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-xs font-semibold ${isActive ? "bg-[var(--volt)] text-[var(--volt-ink)]" : "bg-white/10 text-white"}`
              }
            >
              {label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="ml-auto rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
            Log out
          </button>
        </nav>
      )}

      {/* Content canvas */}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
