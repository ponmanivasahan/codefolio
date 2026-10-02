import { MapPinIcon } from "@heroicons/react/24/outline";
﻿import React from "react";
import CommandPalette from "./components/CommandPalette.jsx";
import DNAChart from "./components/DNAChart.jsx";
import ContactForm from "./components/ContactForm.jsx";

export default function ExecutiveTemplate({ data }) {
  const { profile, projects, skills, socialLinks } = data;
  const cats = [...new Set(skills.map(s => s.category))];
  const featured = projects.filter(p => p.featured);
  const shown = featured.length ? featured : projects;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <CommandPalette data={data} />

      {/* Sidebar layout on desktop */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left sidebar */}
        <aside className="lg:w-80 lg:fixed lg:inset-y-0 lg:left-0 bg-slate-800 border-r border-slate-700 overflow-y-auto flex flex-col">
          <div className="p-8 flex-1">
            {/* Avatar */}
            <div className="mb-8">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.displayName} className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-600 mb-4" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black mb-4">
                  {profile.displayName?.[0]}
                </div>
              )}
              <h1 className="text-2xl font-black text-white">{profile.displayName}</h1>
              <p className="text-primary-400 text-sm mt-1">{profile.headline}</p>
              {profile.location && <p className="text-slate-500 text-xs mt-2"><MapPinIcon className="w-4 h-4 inline-block mr-1" /> {profile.location}</p>}
            </div>

            {/* About */}
            {profile.bio && (
              <div className="mb-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">About</h2>
                <p className="text-slate-300 text-sm leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Social */}
            {socialLinks.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Connect</h2>
                <div className="space-y-2">
                  {socialLinks.map(l => (
                    <a key={l.id} href={l.url} target="_blank"
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                      <span>→</span> {l.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Resume */}
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank"
                className="block w-full text-center py-3 border border-primary-500 text-primary-400 text-sm font-semibold hover:bg-primary-500/10 transition-colors rounded-xl">
                Download Resume
              </a>
            )}

            {/* DNA */}
            {skills.length >= 3 && (
              <div className="mt-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Developer DNA</h2>
                <DNAChart skills={skills} />
              </div>
            )}
          </div>
          <div className="px-8 py-4 border-t border-slate-700 text-xs text-slate-600">
            Built with CodeFolio
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-80 overflow-x-hidden">
          {/* Skills */}
          {skills.length > 0 && (
            <section id="skills" className="px-8 py-16 border-b border-slate-800">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Expertise</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {cats.map(cat => (
                  <div key={cat}>
                    <h3 className="text-sm font-bold text-primary-400 mb-4">{cat}</h3>
                    <div className="space-y-3">
                      {skills.filter(s => s.category === cat).map(s => (
                        <div key={s.id}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-sm text-slate-200">{s.name}</span>
                            <span className="text-xs text-slate-500">{s.proficiency}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-primary-600 to-primary-400 h-1.5 rounded-full" style={{ width: `${s.proficiency}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section id="projects" className="px-8 py-16 border-b border-slate-800">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Selected Work</h2>
              <div className="space-y-10">
                {shown.map((p, i) => (
                  <div id={`project-${p.id}`} key={p.id} className="flex gap-8 group">
                    <div className="text-4xl font-black text-slate-800 group-hover:text-slate-700 transition-colors w-12 flex-shrink-0 pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 pb-10 border-b border-slate-800 last:border-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-white">{p.title}</h3>
                        <div className="flex gap-2 flex-shrink-0">
                          {p.repoUrl && <a href={p.repoUrl} target="_blank" className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1 rounded-lg transition-colors">GitHub →</a>}
                          {p.liveUrl && <a href={p.liveUrl} target="_blank" className="text-xs text-white bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded-lg transition-colors">Live →</a>}
                        </div>
                      </div>
                      <p className="text-slate-400 mb-5 leading-relaxed">{p.description}</p>

                      {(p.problem || p.impact) && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                          {p.problem && (
                            <div className="bg-slate-800 rounded-xl p-4">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Problem</p>
                              <p className="text-sm text-slate-300">{p.problem}</p>
                            </div>
                          )}
                          {p.solution && (
                            <div className="bg-slate-800 rounded-xl p-4">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Solution</p>
                              <p className="text-sm text-slate-300">{p.solution}</p>
                            </div>
                          )}
                          {p.impact && (
                            <div className="bg-primary-900/20 border border-primary-900 rounded-xl p-4">
                              <p className="text-xs font-bold text-primary-500 uppercase mb-2">Impact</p>
                              <p className="text-sm text-primary-300">{p.impact}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {p.techStack && (
                        <div className="flex flex-wrap gap-2">
                          {p.techStack.split(",").map(t => <span key={t} className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">{t.trim()}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact */}
          <section id="contact" className="px-8 py-16">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Contact</h2>
            <h3 className="text-3xl font-black text-white mb-8">Let's work together</h3>
            <div className="max-w-lg">
              <ContactForm username={profile.username} theme="dark" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
