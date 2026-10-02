import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await register(form);
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Create Account — CodeFolio</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <nav className="px-6 py-4">
          <Link to="/" className="text-xl font-black gradient-text">CodeFolio</Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="card p-8">
              <h1 className="text-2xl font-bold mb-1">Create your portfolio</h1>
              <p className="text-gray-500 text-sm mb-7">Free forever. No credit card needed.</p>
              {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 mb-5">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Full name</label>
                  <input type="text" required className="input" placeholder="Jane Doe" value={form.name} onChange={set("name")} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" required className="input" placeholder="jane@example.com" value={form.email} onChange={set("email")} />
                </div>
                <div>
                  <label className="label">Username <span className="text-gray-400 font-normal">(codefolio.dev/username)</span></label>
                  <input type="text" required className="input" placeholder="jane-doe" value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))} />
                  <p className="text-xs text-gray-400 mt-1">Lowercase letters, numbers, hyphens. Min 3 chars.</p>
                </div>
                <div>
                  <label className="label">Password</label>
                  <input type="password" required minLength={8} className="input" placeholder="Min 8 characters" value={form.password} onChange={set("password")} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Creating account..." : "Create my portfolio →"}
                </button>
              </form>
              <p className="text-sm text-center text-gray-500 mt-6">
                Already have an account? <Link to="/login" className="text-primary-600 font-semibold">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
