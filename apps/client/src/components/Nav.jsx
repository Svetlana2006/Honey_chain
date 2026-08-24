import { NavLink } from "react-router-dom";

const links = [
  { to: "/", icon: "inventory_2", label: "Batches" },
  { to: "/ledger", icon: "account_tree", label: "Ledger" },
  { to: "/verify", icon: "qr_code_scanner", label: "Verify" },
  { to: "/trust-score", icon: "analytics", label: "Trust Score" },
  { to: "/fair-price", icon: "sell", label: "Fair Price" },
];

// ---- Desktop Sidebar ----
export function Sidebar() {
  return (
    <nav className="hidden md:flex flex-col h-screen sticky top-0 w-64 shrink-0 p-4 border-r border-secondary/10 bg-surface-container-low">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined icon-fill text-on-primary-container">
            hive
          </span>
        </div>
        <div>
          <h1 className="font-bold text-xl text-primary">Honey Chain</h1>
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">
            Blockchain Verification
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-1 flex-1">
        {links.map(({ to, icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : "text-on-surface-variant hover:bg-surface-variant/50"
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">
                {icon}
              </span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="border-t border-secondary/10 pt-4 px-2 text-[11px] uppercase tracking-widest text-on-surface-variant">
        KVIC Honey Mission
      </div>
    </nav>
  );
}

// ---- Mobile Top Bar ----
export function TopBar() {
  return (
    <header className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center px-4 py-4 bg-surface/80 backdrop-blur-xl border-b border-secondary/10 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined icon-fill text-primary">
          hive
        </span>
        <span className="font-bold text-lg text-primary">Honey Chain</span>
      </div>
      <div className="flex gap-2">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `text-[11px] uppercase tracking-widest px-3 py-1 rounded-full border transition-all
              ${
                isActive
                  ? "bg-primary-container border-transparent text-on-primary-container font-bold"
                  : "border-secondary/30 text-secondary"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}

// ---- Mobile Bottom Nav ----
export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface/80 backdrop-blur-md border-t border-secondary/10 rounded-t-xl">
      {links.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center p-2 rounded-lg transition-all
            ${
              isActive
                ? "bg-primary-container text-on-primary-container px-4"
                : "text-on-surface-variant"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
          <span className="text-[10px] font-semibold mt-0.5">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
