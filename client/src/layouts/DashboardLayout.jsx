import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  HomeIcon, UserIcon, FolderIcon, AcademicCapIcon,
  LinkIcon, PaintBrushIcon, ChartBarIcon, EnvelopeIcon,
  GlobeAltIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon,
  SunIcon, MoonIcon, Bars3Icon, XMarkIcon, EyeIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";
import { api } from "../services/api.js";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: HomeIcon, end: true },
  { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
  { to: "/dashboard/projects", label: "Projects", icon: FolderIcon },
  { to: "/dashboard/skills", label: "Skills", icon: AcademicCapIcon },
  { to: "/dashboard/social-links", label: "Social Links", icon: LinkIcon },
  { to: "/dashboard/design", label: "Design", icon: PaintBrushIcon },
  { to: "/dashboard/analytics", label: "Analytics", icon: ChartBarIcon },
  { to: "/dashboard/messages", label: "Messages", icon: EnvelopeIcon },
  { to: "/dashboard/domain", label: "Domain", icon: GlobeAltIcon },
  { to: "/dashboard/settings", label: "Settings", icon: Cog6ToothIcon },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [pubMsg, setPubMsg] = useState("");

  const profile = user?.profile;
  const isPublished = profile?.status === "PUBLISHED";

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.post("/publish");
      setPubMsg("Portfolio is live!");
      setTimeout(() => setPubMsg(""), 3000);
    } catch { setPubMsg("Publish failed. Try again."); }
    setPublishing(false);
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 py-6 px-4 overflow-y-auto">
      <div className="mb-8 px-2">
        <span className="text-2xl font-black gradient-text">CodeFolio</span>
        <p className="text-xs text-gray-500 mt-0.5">Developer Portfolio Builder</p>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"}`}
            onClick={() => setSidebarOpen(false)}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white w-full">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Log out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-40">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 bg-white dark:bg-gray-900 z-50">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1">
              <XMarkIcon className="w-5 h-5" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bars3Icon className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <span className={`badge text-xs ${isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {isPublished ? "â— Published" : "â— Draft"}
            </span>
            {pubMsg && <span className="ml-3 text-sm text-green-600 font-medium">{pubMsg}</span>}
          </div>
          <div className="flex items-center gap-2">
            {profile?.username && (
              <a href={`/${profile.username}`} target="_blank" rel="noreferrer"
                className="btn-ghost text-sm flex items-center gap-1.5">
                <EyeIcon className="w-4 h-4" /> Preview
              </a>
            )}
            <button onClick={handlePublish} disabled={publishing}
              className="btn-primary text-sm flex items-center gap-1.5 py-2 px-4">
              <RocketLaunchIcon className="w-4 h-4" />
              {publishing ? "Publishing..." : "Publish"}
            </button>
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet context={{ user, refreshUser: () => {} }} />
        </main>
      </div>
    </div>
  );
}


