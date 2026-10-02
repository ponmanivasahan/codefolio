import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect to get started",
    cta: "Get started free",
    href: "/register",
    primary: false,
    features: [
      { text: "1 portfolio", included: true },
      { text: "Minimal & Terminal templates", included: true },
      { text: "codefolio.dev/username URL", included: true },
      { text: "Projects, Skills, Social Links", included: true },
      { text: "Contact form (3 messages/day)", included: true },
      { text: "Basic analytics", included: true },
      { text: "Cyber Grid & Executive templates", included: false },
      { text: "Custom domain", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Portfolio DNA visualization", included: false },
      { text: "Remove CodeFolio branding", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    desc: "For serious developers",
    cta: "Start Pro — $9/mo",
    href: "/register?plan=pro",
    primary: true,
    features: [
      { text: "1 portfolio", included: true },
      { text: "All 4 templates (incl. Cyber Grid & Executive)", included: true },
      { text: "codefolio.dev/username URL", included: true },
      { text: "Projects, Skills, Social Links", included: true },
      { text: "Unlimited contact messages", included: true },
      { text: "Advanced analytics + device breakdown", included: true },
      { text: "Custom domain (john.com)", included: true },
      { text: "Portfolio DNA visualization", included: true },
      { text: "Code Timeline feature", included: true },
      { text: "Remove CodeFolio branding", included: true },
      { text: "Version history & rollback", included: true },
      { text: "Priority support", included: true },
    ],
  },
];

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing — CodeFolio</title>
        <meta name="description" content="Simple, transparent pricing for CodeFolio developer portfolios. Start free, upgrade when ready." />
      </Helmet>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="text-xl font-black gradient-text">CodeFolio</Link>
            <div className="flex gap-3">
              <Link to="/login" className="btn-ghost text-sm">Log in</Link>
              <Link to="/register" className="btn-primary text-sm">Start free</Link>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">Simple pricing</h1>
            <p className="text-xl text-gray-500">No tricks, no hidden fees. Upgrade or downgrade anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map(plan => (
              <div key={plan.name} className={`rounded-3xl p-8 border-2 ${plan.primary ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"}`}>
                <div className="mb-6">
                  {plan.primary && <span className="badge bg-primary-600 text-white mb-3 text-xs px-3 py-1 rounded-full">Most Popular</span>}
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className="text-gray-500 mb-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-500 mt-1">{plan.desc}</p>
                </div>
                <Link to={plan.href} className={`block text-center py-3 rounded-xl font-bold mb-8 transition-all ${plan.primary ? "btn-primary" : "btn-secondary"}`}>
                  {plan.cta}
                </Link>
                <ul className="space-y-3">
                  {plan.features.map(f => (
                    <li key={f.text} className="flex items-start gap-3">
                      {f.included
                        ? <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        : <XMarkIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />}
                      <span className={`text-sm ${f.included ? "text-gray-700 dark:text-gray-200" : "text-gray-400 line-through"}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">FAQ</h3>
            <div className="max-w-2xl mx-auto space-y-6 text-left">
              {[
                ["Do I need a credit card to start?", "No. The Free plan never requires a credit card."],
                ["Can I cancel anytime?", "Yes. Cancel your Pro subscription any time. Your portfolio stays on Free plan."],
                ["What happens if I downgrade?", "Pro-only templates will show a fallback. Your data stays safe."],
                ["Can I use my own domain?", "Yes, with the Pro plan. Point your CNAME to codefolio.vercel.app and we handle the rest."],
              ].map(([q, a]) => (
                <div key={q} className="card p-6">
                  <h4 className="font-semibold mb-2">{q}</h4>
                  <p className="text-gray-500 text-sm">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
