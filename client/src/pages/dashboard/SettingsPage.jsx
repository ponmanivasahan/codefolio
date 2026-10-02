import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../services/api.js";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [delConfirm, setDelConfirm] = useState("");
  const [delLoading, setDelLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.newPassword !== pwForm.confirm) { setPwError("Passwords do not match"); return; }
    if (pwForm.newPassword.length < 8) { setPwError("Password must be at least 8 characters"); return; }
    try {
      await api.post("/auth/reset-password", { password: pwForm.newPassword, token: "placeholder" });
      setPwSuccess(true);
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <>
      <Helmet><title>Settings - CodeFolio Dashboard</title></Helmet>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-surface-500 mt-1">Manage your account preferences</p>
        </div>

        <div className="space-y-12 pb-12">
          
          {/* Account info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="font-semibold text-lg text-surface-900 dark:text-white mb-2">Account</h2>
              <p className="text-sm text-surface-500 leading-relaxed">Your personal CodeFolio account details and current subscription plan.</p>
            </div>
            <div className="md:col-span-2 card p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-lg text-surface-900 dark:text-white">{user?.name}</p>
                  <p className="text-surface-500">{user?.email}</p>
                  <p className="text-sm text-surface-400 mt-0.5">@{user?.username}</p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-surface-200 dark:border-surface-800">
                <p className="text-sm text-surface-500 mb-2">Current Plan</p>
                <span className={`badge px-3 py-1 text-xs font-bold uppercase ${user?.subscription?.plan === "PRO" ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-200 dark:border-primary-800" : "bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300"}`}>
                  {user?.subscription?.plan || "FREE"} Plan
                </span>
              </div>
            </div>
          </div>

          <hr className="border-surface-200 dark:border-surface-800" />

          {/* Security */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="font-semibold text-lg text-surface-900 dark:text-white mb-2">Security</h2>
              <p className="text-sm text-surface-500 leading-relaxed">Update your password to keep your account secure.</p>
            </div>
            <div className="md:col-span-2 card p-6 sm:p-8">
              {pwSuccess && <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium rounded-xl p-4 mb-6">Password updated successfully!</div>}
              {pwError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl p-4 mb-6">{pwError}</div>}
              <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" value={pwForm.newPassword} minLength={8}
                    onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="Min 8 characters" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input type="password" className="input" value={pwForm.confirm}
                    onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat password" />
                </div>
                <button type="submit" className="btn-primary">Update password</button>
              </form>
            </div>
          </div>

          <hr className="border-surface-200 dark:border-surface-800" />

          {/* Danger zone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="font-semibold text-lg text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5" /> Danger Zone
              </h2>
              <p className="text-sm text-surface-500 leading-relaxed">Permanently remove your account and all associated data.</p>
            </div>
            <div className="md:col-span-2 card p-6 sm:p-8 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-6 font-medium">Deleting your account is permanent and cannot be undone. All your portfolio data, projects, and custom domains will be wiped immediately.</p>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="label text-sm text-surface-900 dark:text-white">Type your username to confirm: <code className="bg-white dark:bg-surface-900 px-2 py-1 rounded-md border border-surface-200 dark:border-surface-700 ml-1 text-red-600 dark:text-red-400 font-bold">{user?.username}</code></label>
                  <input className="input" value={delConfirm} onChange={e => setDelConfirm(e.target.value)} placeholder="Type username..." />
                </div>
                <button
                  disabled={delConfirm !== user?.username || delLoading}
                  onClick={async () => {
                    if (!confirm("Are you absolutely sure?")) return;
                    setDelLoading(true);
                    try { await api.delete(`/auth/account`); logout(); navigate("/"); }
                    catch { alert("Account deletion failed. Please contact support."); setDelLoading(false); }
                  }}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm">
                  {delLoading ? "Deleting..." : "Delete account permanently"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}