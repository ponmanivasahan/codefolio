import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "../../services/api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Forgot Password — CodeFolio</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <nav className="px-6 py-4"><Link to="/" className="text-xl font-black gradient-text">CodeFolio</Link></nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md card p-8">
            {sent ? (
              <div className="text-center">
                <div className="text-5xl mb-4">📧</div>
                <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                <p className="text-gray-500">If an account exists for <strong>{email}</strong>, a reset link was sent.</p>
                <Link to="/login" className="btn-primary mt-6 inline-block">Back to login</Link>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-1">Forgot your password?</h1>
                <p className="text-gray-500 text-sm mb-7">Enter your email and we'll send a reset link.</p>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-5">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="label">Email address</label>
                    <input type="email" required className="input" placeholder="you@example.com"
                      value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? "Sending..." : "Send reset link"}
                  </button>
                </form>
                <p className="text-sm text-center text-gray-500 mt-6">
                  <Link to="/login" className="text-primary-600 hover:text-primary-700">Back to login</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
