import { MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
﻿import React, { useState, useEffect } from "react";
import CommandPalette from "./components/CommandPalette.jsx";
import ContactForm from "./components/ContactForm.jsx";
import DNAChart from "./components/DNAChart.jsx";

function TypedText({ text, speed = 50 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text]);
  return <span>{displayed}<span className="cursor-blink text-green-400">█</span></span>;
}

export default function TerminalTemplate({ data }) {
  const { profile, projects, skills, socialLinks } = data;
  const cats = [...new Set(skills.map(s => s.category))];

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono">
      <CommandPalette data={data} />

      {/* Terminal header bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-2 sticky top-0 z-10">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-gray-400 text-xs">{profile.username}@codefolio:~</span>
        <div className="ml-auto text-xs text-gray-500">Ctrl+K for command palette</div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="mb-16">
          <div className="text-gray-500 mb-2 text-sm">$ whoami</div>
          <h1 className="text-4xl font-black text-green-400 mb-3">
            <TypedText text={profile.displayName || ""} speed={80} />
          </h1>
          <div className="text-gray-400 mb-1 text-sm">$ cat headline.txt</div>
          <p className="text-green-300 mb-6">{profile.headline}</p>

          {profile.bio && (
            <>
              <div className="text-gray-400 mb-1 text-sm">$ cat bio.txt</div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">{profile.bio}</p>
            </>
          )}

          {profile.location && (
            <div className="text-gray-400 text-sm"><MapPinIcon className="w-4 h-4 inline-block mr-1" /> {profile.location}</div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" className="border border-green-500 text-green-400 px-4 py-1.5 text-sm hover:bg-green-500 hover:text-gray-900 transition-colors rounded">
                ./download-resume.sh
              </a>
            )}
            {profile.githubUsername && (
              <a href={`https://github.com/${profile.githubUsername}`} target="_blank" className="border border-gray-600 text-gray-400 px-4 py-1.5 text-sm hover:border-green-500 hover:text-green-400 transition-colors rounded">
                ssh github.com/{profile.githubUsername}
              </a>
            )}
          </div>
        </section>

        {/* Skills */}
        {skills.length > 0 && (
          <section id="skills" className="mb-16">
            <div className="text-gray-500 mb-3 text-sm">$ ls -la skills/</div>
            <div className="space-y-4">
              {cats.map(cat => (
                <div key={cat}>
                  <div className="text-gray-500 text-xs mb-2">drwxr-xr-x  {skills.filter(s => s.category === cat).length}  <span className="text-green-400">{cat}/</span></div>
                  <div className="ml-4 flex flex-wrap gap-2">
                    {skills.filter(s => s.category === cat).map(s => (
                      <div key={s.id} className="flex items-center gap-2">
                        <span className="text-green-300 text-sm">{s.name}</span>
                        <div className="w-16 bg-gray-800 rounded h-1">
                          <div className="bg-green-500 h-1 rounded" style={{ width: `${s.proficiency}%` }} />
                        </div>
                        <span className="text-gray-600 text-xs">{s.proficiency}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DNA */}
        {skills.length >= 3 && (
          <section className="mb-16 border border-gray-800 rounded-xl p-6">
            <div className="text-gray-500 mb-4 text-sm">$ ./analyze-dna.sh --developer {profile.username}</div>
            <DNAChart skills={skills} />
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section id="projects" className="mb-16">
            <div className="text-gray-500 mb-3 text-sm">$ ls -la ~/projects/</div>
            <div className="space-y-8">
              {projects.map((p, i) => (
                <div id={`project-${p.id}`} key={p.id} className="border border-gray-800 rounded-xl p-6 hover:border-green-800 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-green-600 text-sm">{String(i + 1).padStart(2, "0")}.</span>
                    <h3 className="text-green-300 font-bold text-lg">{p.title}</h3>
                    {p.featured && <span className="text-yellow-500 text-xs border border-yellow-800 px-2 py-0.5 rounded"><StarIcon className="w-3 h-3 inline-block mr-1" /> featured</span>}
                  </div>
                  <p className="text-gray-400 mb-4 leading-relaxed">{p.description}</p>
                  {p.impact && (
                    <div className="border-l-2 border-green-700 pl-4 mb-4">
                      <p className="text-xs text-green-600 mb-1"># impact</p>
                      <p className="text-green-300 text-sm">{p.impact}</p>
                    </div>
                  )}
                  {p.techStack && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.techStack.split(",").map(t => <span key={t} className="text-xs border border-gray-700 text-gray-500 px-2 py-0.5 rounded">{t.trim()}</span>)}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {p.repoUrl && <a href={p.repoUrl} target="_blank" className="text-green-500 text-xs hover:underline">git clone →</a>}
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" className="text-cyan-500 text-xs hover:underline">curl -X GET {p.liveUrl} →</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section id="contact" className="mb-16">
          <div className="text-gray-500 mb-4 text-sm">$ ./send-message.sh --to {profile.username}</div>
          <div className="border border-gray-800 rounded-xl p-6">
            <ContactForm username={profile.username} theme="dark" />
          </div>
        </section>

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-4 text-sm border-t border-gray-800 pt-6">
            {socialLinks.map(l => (
              <a key={l.id} href={l.url} target="_blank" className="text-gray-500 hover:text-green-400 transition-colors">
                {l.platform} &nearr;
              </a>
            ))}
          </div>
        )}

        <div className="mt-6 text-gray-700 text-xs">-- CodeFolio v1.0.0 · Press Ctrl+K for command palette</div>
      </div>
    </div>
  );
}
