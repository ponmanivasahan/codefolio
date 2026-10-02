import React from "react";

export default function DNAChart({ skills }) {
  const categories = ["Frontend", "Backend", "Database", "DevOps", "Tools", "Other"];
  const colorMap = {
    Frontend: "#6366f1",
    Backend: "#10b981",
    Database: "#8b5cf6",
    DevOps: "#f59e0b",
    Tools: "#06b6d4",
    Other: "#ec4899",
  };

  const skillsByCategory = categories.reduce((acc, cat) => {
    const catSkills = skills.filter(s => s.category === cat);
    if (catSkills.length > 0) {
      const avg = Math.round(catSkills.reduce((sum, s) => sum + s.proficiency, 0) / catSkills.length);
      acc[cat] = { count: catSkills.length, avg, skills: catSkills.slice(0, 3).map(s => s.name) };
    }
    return acc;
  }, {});

  const entries = Object.entries(skillsByCategory);
  if (!entries.length) return null;

  const maxCount = Math.max(...entries.map(([, v]) => v.count), 1);

  return (
    <div className="space-y-3">
      {entries.map(([cat, { count, avg, skills: topSkills }]) => (
        <div key={cat} className="flex items-center gap-3 group">
          <div className="w-20 text-xs font-semibold text-right" style={{ color: colorMap[cat] }}>{cat}</div>
          <div className="flex-1 relative h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 flex items-center px-2"
              style={{ width: `${(count / maxCount) * 100}%`, background: `linear-gradient(90deg, ${colorMap[cat]}aa, ${colorMap[cat]})` }}>
              <span className="text-white text-xs font-bold truncate">{topSkills.join(", ")}</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 w-10 text-right font-mono">{avg}%</div>
        </div>
      ))}
    </div>
  );
}
