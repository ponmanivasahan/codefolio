import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api.js";
import PortfolioRenderer from "../templates/PortfolioRenderer.jsx";

const RESERVED = ["admin","login","register","dashboard","api","settings","about","contact","pricing","onboarding","forgot-password","reset-password"];

export default function PublicPortfolio() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (RESERVED.includes(username)) { navigate("/"); return; }
    api.get(`/portfolio/${username}`)
      .then(r => setData(r.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading portfolio...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center max-w-md px-4">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold mb-3">Portfolio not found</h1>
        <p className="text-gray-500 mb-6">@{username}'s portfolio doesn't exist or isn't published yet.</p>
        <a href="/" className="btn-primary">← Back to CodeFolio</a>
      </div>
    </div>
  );

  const profile = data?.profile;
  const title = profile?.displayName
    ? `${profile.displayName} — ${profile.headline || "Developer Portfolio"}`
    : `${username} — CodeFolio`;
  const description = profile?.bio
    ? profile.bio.slice(0, 160)
    : `Check out ${profile?.displayName || username}'s developer portfolio on CodeFolio.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="profile" />
        {profile?.profileImage && <meta property="og:image" content={profile.profileImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {profile?.profileImage && <meta name="twitter:image" content={profile.profileImage} />}
        <link rel="canonical" href={`https://codefolio.dev/${username}`} />
      </Helmet>
      <PortfolioRenderer data={data} />
    </>
  );
}

