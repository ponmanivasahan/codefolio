import React, { lazy, Suspense } from "react";

const MinimalTemplate = lazy(() => import("./MinimalTemplate.jsx"));
const TerminalTemplate = lazy(() => import("./TerminalTemplate.jsx"));
const CyberGridTemplate = lazy(() => import("./CyberGridTemplate.jsx"));
const ExecutiveTemplate = lazy(() => import("./ExecutiveTemplate.jsx"));

const templateMap = {
  minimal: MinimalTemplate,
  terminal: TerminalTemplate,
  "cyber-grid": CyberGridTemplate,
  executive: ExecutiveTemplate,
};

export default function PortfolioRenderer({ data }) {
  if (!data) return null;
  const slug = data?.profile?.template?.slug || "minimal";
  const Template = templateMap[slug] || MinimalTemplate;

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Template data={data} />
    </Suspense>
  );
}
