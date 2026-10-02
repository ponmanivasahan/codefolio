const fs = require("fs");
const path = require("path");

const files = [
  "client/src/components/EmptyState.jsx",
  "client/src/components/ErrorState.jsx",
  "client/src/layouts/DashboardLayout.jsx",
  "client/src/pages/Landing.jsx",
  "client/src/pages/Onboarding.jsx",
  "client/src/pages/Pricing.jsx",
  "client/src/pages/PublicPortfolio.jsx",
  "client/src/templates/CyberGridTemplate.jsx",
  "client/src/templates/ExecutiveTemplate.jsx",
  "client/src/templates/MinimalTemplate.jsx",
  "client/src/templates/TerminalTemplate.jsx",
];

const replaceMap = {
  // Landing
  "👨‍💻": "<ComputerDesktopIcon className=\"w-10 h-10 text-surface-500\" />",
  "🚀": "<RocketLaunchIcon className=\"w-6 h-6\" />",
  "🧬": "<BeakerIcon className=\"w-6 h-6\" />",
  "⚡": "<BoltIcon className=\"w-6 h-6\" />",
  "Command Center →": "Command Center &rarr;",
  "Next →": "Next &rarr;",
  "Get Started →": "Get Started &rarr;",
  // Layouts
  "? Published": "Published",
  "? Draft": "Draft",
  // Components
  "📭": "<FolderOpenIcon className=\"w-12 h-12\" />",
  "⚠️": "<ExclamationTriangleIcon className=\"w-12 h-12\" />",
  // Onboarding
  "🚀": "<RocketLaunchIcon className=\"w-10 h-10\" />",
  // Portfolio
  "🤷": "<QuestionMarkCircleIcon className=\"w-24 h-24 mx-auto text-surface-300\" />",
  // Templates
  "📍": "<MapPinIcon className=\"w-4 h-4 inline-block mr-1\" />",
  "📄": "<DocumentTextIcon className=\"w-4 h-4 inline-block mr-1\" />",
  "🔗": "<LinkIcon className=\"w-4 h-4 inline-block mr-1\" />",
  "⭐": "<StarIcon className=\"w-3 h-3 inline-block mr-1\" />",
  "↙": "&searr;",
  "↗": "&nearr;",
  "✨": "<SparklesIcon className=\"w-4 h-4 inline-block mr-1\" />",
};

files.forEach(f => {
  let p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, "utf-8");
    
    // Auto import heroicons if we are inserting them
    let importsToAdd = [];
    if (content.includes("👨‍💻")) importsToAdd.push("ComputerDesktopIcon");
    if (content.includes("🚀")) importsToAdd.push("RocketLaunchIcon");
    if (content.includes("🧬")) importsToAdd.push("BeakerIcon");
    if (content.includes("⚡")) importsToAdd.push("BoltIcon");
    if (content.includes("📭")) importsToAdd.push("FolderOpenIcon");
    if (content.includes("⚠️")) importsToAdd.push("ExclamationTriangleIcon");
    if (content.includes("🤷")) importsToAdd.push("QuestionMarkCircleIcon");
    if (content.includes("📍")) importsToAdd.push("MapPinIcon");
    if (content.includes("📄")) importsToAdd.push("DocumentTextIcon");
    if (content.includes("🔗")) importsToAdd.push("LinkIcon");
    if (content.includes("⭐")) importsToAdd.push("StarIcon");
    if (content.includes("✨")) importsToAdd.push("SparklesIcon");

    if (importsToAdd.length > 0) {
      if (content.includes("@heroicons/react/24/outline")) {
        // we could parse and append, but easier to just prepend a new import line for simplicity
        content = `import { ${importsToAdd.join(", ")} } from "@heroicons/react/24/outline";\n` + content;
      } else {
        content = `import { ${importsToAdd.join(", ")} } from "@heroicons/react/24/outline";\n` + content;
      }
    }

    // Replace all keys
    for (let [key, val] of Object.entries(replaceMap)) {
      content = content.split(key).join(val);
    }
    
    // Custom regex fixes for things that were garbled in standard view
    content = content.replace(/ðŸ‘¨â€ ðŸ’»/g, "<ComputerDesktopIcon className=\"w-10 h-10 text-surface-500\" />");
    content = content.replace(/ðŸš€/g, "<RocketLaunchIcon className=\"w-6 h-6\" />");
    content = content.replace(/ðŸ§¬/g, "<BeakerIcon className=\"w-6 h-6\" />");
    content = content.replace(/âš¡/g, "<BoltIcon className=\"w-6 h-6\" />");

    fs.writeFileSync(p, content, "utf-8");
  }
});
console.log("Done replacing emojis");