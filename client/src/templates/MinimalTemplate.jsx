import React from "react";
import { LinkIcon, MapPinIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import CommandPalette from "./components/CommandPalette.jsx";
import DNAChart from "./components/DNAChart.jsx";
import ContactForm from "./components/ContactForm.jsx";

export default function MinimalTemplate({ data }) {
  const { profile, projects, skills, socialLinks } = data;
  const featured = projects.filter(p => p.featured);
  const allProjects = featured.length ? featured : projects;
  const accentColor = profile.accentColor || "#6366f1";
  const cats = [...new Set(skills.map(s => s.category))];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <CommandPalette data={data} />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center gap-6 mb-8">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt={profile.displayName} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: accentColor }}>
              {profile.displayName?.[0]}
            </div>
          )}
          <div>
            <h1 className="text-4xl font-black tracking-tight">{profile.displayName}</h1>
            <h2 className="text-xl text-gray-500 mt-2 font-medium">{profile.headline}</h2>
            {profile.location && <p className="text-gray-400 text-sm mt-0.5 flex items-center gap-1"><MapPinIcon className="w-4 h-4"/> {profile.location}</p>}
          </div>
        </div>

        <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl">{profile.bio}</p>

        <div className="flex gap-4">
          {socialLinks.map(l => (
            <a key={l.id} href={l.url} target="_blank" className="text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1">
              <GlobeAltIcon className="w-5 h-5"/>
              <span className="text-sm font-medium">{l.platform}</span>
            </a>
          ))}
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" className="text-white px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90 flex items-center gap-2 ml-4" style={{ backgroundColor: accentColor }}>
              View Resume
            </a>
          )}
        </div>
      </section>

      {/* Projects */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-8">Selected Work</h3>
          <div className="space-y-12">
            {allProjects.map(p => (
              <div key={p.id} className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <h4 className="text-xl font-bold group-hover:text-primary-600 transition-colors">{p.title}</h4>
                  <div className="flex gap-3">
                    {p.repoUrl && <a href={p.repoUrl} target="_blank" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"><GlobeAltIcon className="w-4 h-4"/> Source</a>}
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" className="text-sm font-medium px-3 py-1 rounded-full transition-colors text-white flex items-center gap-1" style={{ backgroundColor: accentColor }}><LinkIcon className="w-4 h-4"/> Live</a>}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.techStack.split(',').map(t => (
                    <span key={t} className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-md">{t.trim()}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-8">Expertise & DNA</h3>
          
          <div className="mb-12">
            <DNAChart skills={skills} />
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {cats.map(cat => (
              <div key={cat}>
                <h4 className="font-bold mb-4">{cat}</h4>
                <div className="space-y-3">
                  {skills.filter(s => s.category === cat).map(s => (
                    <div key={s.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{s.name}</span>
                        <span className="text-gray-400">{s.proficiency}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.proficiency}%`, backgroundColor: accentColor }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-8">Get in Touch</h3>
          <ContactForm profile={profile} />
        </div>
      </section>
    </div>
  );
}