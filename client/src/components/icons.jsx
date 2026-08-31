
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export const IconGrid = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
export const IconUsers = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c1-3.6 3.6-5.5 6.5-5.5s5.5 1.9 6.5 5.5" />
    <circle cx="17.5" cy="9" r="2.4" /><path d="M15.8 14.6c2.2.2 4 1.9 4.8 4.9" />
  </svg>
);
export const IconScan = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M3 7V4.5A1.5 1.5 0 0 1 4.5 3H7M17 3h2.5A1.5 1.5 0 0 1 21 4.5V7" />
    <path d="M21 17v2.5a1.5 1.5 0 0 1-1.5 1.5H17M7 21H4.5A1.5 1.5 0 0 1 3 19.5V17" />
    <line x1="3.5" y1="12" x2="20.5" y2="12" />
  </svg>
);
export const IconClock = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" />
  </svg>
);
export const IconTag = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M11.6 3H5a2 2 0 0 0-2 2v6.6c0 .5.2 1 .6 1.4l9 9a2 2 0 0 0 2.8 0l6.2-6.2a2 2 0 0 0 0-2.8l-9-9a2 2 0 0 0-1-.6Z" />
    <circle cx="8" cy="8" r="1.4" />
  </svg>
);
export const IconStaff = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" />
  </svg>
);
export const IconLogout = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" /><path d="M16 17l5-5-5-5" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
export const IconChevron = (p) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...p}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
