import * as React from "react";
import { adminApi } from "@/lib/api";
import type { AdminUser } from "@/lib/api";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

function NavIcon({ children }: { children: React.ReactNode }) {
  return <span className="flex h-5 w-5 items-center justify-center">{children}</span>;
}

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <NavIcon>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7a2 2 0 012-2h5a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm11 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V7zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM3 17a2 2 0 012-2h5a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" />
        </svg>
      </NavIcon>
    ),
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: (
      <NavIcon>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12-1a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      </NavIcon>
    ),
  },
  {
    href: "/admin/skills",
    label: "Skills",
    icon: (
      <NavIcon>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </NavIcon>
    ),
  },
  {
    href: "/admin/experience",
    label: "Experience",
    icon: (
      <NavIcon>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </NavIcon>
    ),
  },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    icon: (
      <NavIcon>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </NavIcon>
    ),
  },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: (
      <NavIcon>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </NavIcon>
    ),
  },
  {
    href: "/admin/seo",
    label: "SEO",
    icon: (
      <NavIcon>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </NavIcon>
    ),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: (
      <NavIcon>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </NavIcon>
    ),
  },
];

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

const ToastContext = React.createContext<{
  addToast: (type: "success" | "error" | "info", message: string) => void;
}>({ addToast: () => {} });

export function useToast() {
  return React.useContext(ToastContext);
}

interface AdminShellProps {
  children: React.ReactNode;
  currentPath?: string;
}

export function AdminShell({ children, currentPath = "" }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [user, setUser] = React.useState<AdminUser | null>(null);
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    adminApi.getMe().then((res) => {
      if (!res.success) {
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
      } else {
        setUser(res.data || null);
      }
    });
    adminApi.getMessages({ is_read: false }).then((res) => {
      if (res.meta) setUnreadCount(res.meta.total);
    });
  }, []);

  const addToast = React.useCallback((type: "success" | "error" | "info", message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  function logout() {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  }

  const navWithBadges = navItems.map((item) =>
    item.href === "/admin/messages" ? { ...item, badge: unreadCount || undefined } : item
  );

  const isActive = (href: string) => {
    if (href === "/admin") return currentPath === "/admin" || currentPath === "/admin/";
    return currentPath.startsWith(href);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-[#12121a] transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
              CMS
            </div>
            <span className="font-semibold text-foreground">Portfolio Admin</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Admin navigation">
            <ul className="space-y-1" role="list">
              {navWithBadges.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* User */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{user?.name || "Admin"}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="text-muted-foreground transition-colors hover:text-foreground"
                title="Logout"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex h-16 items-center gap-4 border-b border-border bg-[#12121a] px-4 md:px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border lg:hidden"
              aria-label="Toggle sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1" />
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Site
            </a>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>

        {/* Toasts */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-sm text-sm font-medium transition-all ${
                toast.type === "success"
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : toast.type === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-blue-500/30 bg-blue-500/10 text-blue-400"
              }`}
            >
              {toast.type === "success" && (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toast.type === "error" && (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
