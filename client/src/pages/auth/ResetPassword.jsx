import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "../../services/api.js";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await api.post("/auth/reset-password", { token, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Link may have expired.");
    } finally { setLoading(false); }
  };

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Invalid reset link. <Link to="/forgot-password" className="text-primary-600">Request a new one.</Link></p>
    </div>
  );

  return (
    <>
      <Helmet><title>Reset Password — CodeFolio</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <nav className="px-6 py-4"><Link to="/" className="text-xl font-black gradient-text">CodeFolio</Link></nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md card p-8">
            <h1 className="text-2xl font-bold mb-1">Set new password</h1>
            <p className="text-gray-500 text-sm mb-7">Choose a strong password.</p>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-5">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">New password</label>
                <input type="password" required minLength={8} className="input" placeholder="Min 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
