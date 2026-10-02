import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Log in — CodeFolio</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <nav className="px-6 py-4">
          <Link to="/" className="text-xl font-black gradient-text">CodeFolio</Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="card p-8">
              <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
              <p className="text-gray-500 text-sm mb-7">Log in to your CodeFolio account</p>
              {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 mb-5">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Email</label>
                  <input type="email" required className="input" placeholder="you@example.com"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="label mb-0">Password</label>
                    <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700">Forgot password?</Link>
                  </div>
                  <input type="password" required className="input" placeholder="••••••••"
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </form>
              <p className="text-sm text-center text-gray-500 mt-6">
                No account? <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Create one free</Link>
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400 text-center mb-3">Try a demo account</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {["demo1","demo2","demo3","demo4"].map(u => (
                    <button key={u} type="button" onClick={() => setForm({ email: `${u}@codefolio.dev`, password: "password123" })}
                      className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
