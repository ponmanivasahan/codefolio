import { MapPinIcon } from "@heroicons/react/24/outline";
import React from "react";
import CommandPalette from "./components/CommandPalette.jsx";
import DNAChart from "./components/DNAChart.jsx";
import ContactForm from "./components/ContactForm.jsx";

export default function CyberGridTemplate({ data }) {
  const { profile, projects, skills, socialLinks } = data;
  const cats = [...new Set(skills.map(s => s.category))];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans cyber-grid-bg animate-fade-in">
      <CommandPalette data={data} />

      {/* Neon nav */}
      <nav className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur border-b border-cyan-900/50 px-6 py-4 flex items-center justify-between animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <span className="font-bold text-cyan-400 font-mono tracking-widest text-sm">{profile.username?.toUpperCase() || "PORTFOLIO"}</span>
        <div className="flex gap-6 text-xs text-gray-500 font-mono">
          <a href="#projects" className="hover:text-cyan-400 transition-colors">PROJECTS</a>
          <a href="#skills" className="hover:text-cyan-400 transition-colors">SKILLS</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500" />
            <span className="text-cyan-400 text-xs font-mono tracking-widest">DEVELOPER PORTFOLIO</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500" />
          </div>

          <h1 className="text-6xl sm:text-8xl font-black mb-4 leading-none hover:scale-105 transition-transform duration-500">
            <span className="text-transparent" style={{ WebkitTextStroke: "2px #06b6d4" }}>{profile.displayName?.split(" ")[0]}</span>
            {profile.displayName?.split(" ").slice(1).join(" ") && (
              <span className="text-white ml-4">{profile.displayName?.split(" ").slice(1).join(" ")}</span>
            )}
          </h1>

          <p className="text-cyan-300 text-xl mb-4 font-light tracking-wide">{profile.headline}</p>

          {profile.bio && <p className="text-gray-400 text-base max-w-2xl leading-relaxed mb-8">{profile.bio}</p>}

          <div className="flex flex-wrap gap-3">
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank"
                className="px-6 py-3 border border-cyan-500 text-cyan-400 text-sm font-semibold hover:bg-cyan-500 hover:text-gray-900 transition-all rounded-lg">
                RESUME &nearr;
              </a>
            )}
            {socialLinks.map(l => (
              <a key={l.id} href={l.url} target="_blank"
                className="px-4 py-3 border border-gray-700 text-gray-400 text-sm hover:border-cyan-700 hover:text-cyan-400 transition-all rounded-lg">
                {l.platform}
              </a>
            ))}
          </div>

          {profile.location && <p className="text-gray-600 text-sm mt-6 font-mono"><MapPinIcon className="w-4 h-4 inline-block mr-1" /> {profile.location}</p>}
        </div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section id="skills" className="px-6 py-20 border-t border-gray-800 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-10">// Skills Matrix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cats.map(cat => (
                <div key={cat} className="border border-gray-800 rounded-xl p-5 hover:border-cyan-900 transition-colors bg-gray-900/30">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">{cat}</h3>
                  <div className="space-y-2.5">
                    {skills.filter(s => s.category === cat).map(s => (
                      <div key={s.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-300">{s.name}</span>
                          <span className="text-xs text-gray-600 font-mono">{s.proficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded h-1">
                          <div className="bg-gradient-to-r from-cyan-500 to-primary-500 h-1 rounded transition-all" style={{ width: `${s.proficiency}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Developer DNA */}
      {skills.length >= 3 && (
        <section className="px-6 py-16 bg-gray-900/30 animate-slide-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-8">// Developer DNA Analysis</h2>
            <DNAChart skills={skills} />
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" className="px-6 py-20 border-t border-gray-800 animate-slide-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-10">// Projects</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((p, idx) => (
                <div id={`project-${p.id}`} key={p.id}
                  className="group border border-gray-800 rounded-2xl p-6 bg-gray-900/20 hover:border-cyan-900 hover:bg-gray-900/40 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-slide-up" style={{ animationDelay: `${1 + idx * 0.1}s`, animationFillMode: 'both' }}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{p.title}</h3>
                    {p.featured && <span className="text-xs bg-cyan-900/30 text-cyan-400 border border-cyan-900 px-2 py-0.5 rounded">Featured</span>}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{p.description}</p>
                  {p.impact && (
                    <div className="bg-cyan-900/20 border border-cyan-900/50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-cyan-400 font-semibold mb-1">IMPACT</p>
                      <p className="text-cyan-200 text-sm">{p.impact}</p>
                    </div>
                  )}
                  {p.techStack && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.techStack.split(",").map(t => <span key={t} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">{t.trim()}</span>)}
                    </div>
                  )}
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.repoUrl && <a href={p.repoUrl} target="_blank" className="text-xs text-cyan-500 hover:underline">→ Source code</a>}
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" className="text-xs text-purple-400 hover:underline">→ Live demo</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="px-6 py-20 border-t border-gray-800 animate-slide-up" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-4">// Initialize Contact</h2>
          <h3 className="text-4xl font-black">Let's Build<br /><span className="text-cyan-400">Something Extraordinary</span></h3>
        </div>
        <div className="max-w-xl mx-auto border border-gray-800 rounded-2xl p-8 bg-gray-900/30">
          <ContactForm username={profile.username} theme="dark" />
        </div>
      </section>

      <footer className="text-center py-6 text-gray-700 text-xs font-mono border-t border-gray-900">
        BUILT WITH CODEFOLIO · CTRL+K FOR COMMANDS
      </footer>
    </div>
  );
}
