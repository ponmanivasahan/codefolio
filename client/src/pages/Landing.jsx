import { ComputerDesktopIcon, RocketLaunchIcon, BeakerIcon, BoltIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext.jsx';

const PREVIEWS = [
  { id: 'frontend', role: 'Frontend Engineer', color: 'from-cyan-500 to-blue-500', 
    name: 'Alex Rivera', 
    desc: 'Building exceptional digital experiences.',
    skills: ['React', 'TypeScript', 'Tailwind']
  },
  { id: 'backend', role: 'Backend Systems Builder', color: 'from-green-500 to-emerald-500', 
    name: 'Sarah Chen', 
    desc: 'Scaling infrastructure to millions of users.',
    skills: ['Go', 'Kubernetes', 'PostgreSQL']
  },
  { id: 'fullstack', role: 'Product-Focused Full Stack', color: 'from-primary-500 to-purple-500', 
    name: 'Marcus Doe', 
    desc: 'Taking ideas from zero to production.',
    skills: ['Next.js', 'Node.js', 'AWS']
  },
];

export default function Landing() {
  const { user } = useAuth();
  const [activePreview, setActivePreview] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePreview(p => (p + 1) % PREVIEWS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const preview = PREVIEWS[activePreview];

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950 overflow-hidden">
      <Helmet><title>CodeFolio - Developer Identity Platform</title></Helmet>
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">C</div>
            <span className="text-xl font-bold font-display tracking-tight text-surface-900 dark:text-white">CodeFolio</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-surface-600 dark:text-surface-400">
            <a href="#features" className="hover:text-surface-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-surface-900 dark:hover:text-white transition-colors">Templates</a>
            <Link to="/pricing" className="hover:text-surface-900 dark:hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="btn-primary">Command Center &rarr;</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost hidden sm:inline-flex">Log in</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="animate-slide-up" style={{ animationFillMode: 'both' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6 border border-primary-200 dark:border-primary-800/50">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              Built for developers who build.
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-surface-900 dark:text-white">
              Your code deserves <br/>
              <span className="gradient-text">more than a GitHub profile.</span>
            </h1>
            
            <p className="text-xl text-surface-600 dark:text-surface-400 mb-10 leading-relaxed max-w-xl">
              Create a developer identity that tells the story behind what you build. Combine your projects, GitHub activity, and interactive resume into one stunning platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">Build My Portfolio</Link>
              <a href="#templates" className="btn-secondary text-lg px-8 py-4">Explore Templates</a>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="w-full max-w-lg aspect-[4/5] sm:aspect-square bg-white dark:bg-surface-900 rounded-2xl shadow-2xl dark:shadow-premium-dark border border-surface-200 dark:border-surface-700 overflow-hidden flex flex-col transition-all duration-500 transform hover:scale-[1.02]">
              
              <div className="h-12 bg-surface-100 dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto w-1/2 h-6 bg-white dark:bg-surface-900 rounded-md border border-surface-200 dark:border-surface-700 flex items-center justify-center text-[10px] text-surface-500 font-mono">
                  codefolio.dev/{preview.name.split(' ')[0].toLowerCase()}
                </div>
              </div>

              <div className="flex-1 p-8 relative flex flex-col justify-center items-center text-center">
                <div className={`absolute inset-0 bg-gradient-to-br ${preview.color} opacity-5 transition-colors duration-1000`} />
                
                <div className="w-24 h-24 rounded-full bg-surface-100 dark:bg-surface-800 mb-6 flex items-center justify-center text-3xl shadow-inner relative z-10">
                  <ComputerDesktopIcon className="w-10 h-10 text-surface-500" />
                </div>
                
                <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-2 relative z-10 transition-all duration-300">
                  {preview.name}
                </h2>
                
                <div className={`text-sm font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r ${preview.color} mb-4 relative z-10 transition-all duration-300`}>
                  {preview.role}
                </div>
                
                <p className="text-surface-500 mb-8 max-w-xs relative z-10">{preview.desc}</p>
                
                <div className="flex gap-2 relative z-10">
                  {preview.skills.map(s => (
                    <span key={s} className="px-3 py-1 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 text-xs rounded-full border border-surface-200 dark:border-surface-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-16 border-t border-surface-200 dark:border-surface-800 flex bg-surface-50 dark:bg-surface-950 p-2 gap-2">
                {PREVIEWS.map((p, i) => (
                  <button 
                    key={p.id}
                    onClick={() => setActivePreview(i)}
                    className={`flex-1 rounded-lg text-xs font-semibold transition-all ${activePreview === i ? 'bg-white dark:bg-surface-800 shadow-sm text-surface-900 dark:text-white' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-900'}`}
                  >
                    {p.id.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="absolute -right-6 top-1/4 card p-4 flex items-center gap-3 animate-float pointer-events-none hidden sm:flex">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">98</div>
              <div>
                <p className="text-xs font-bold text-surface-900 dark:text-white">Portfolio Score</p>
                <p className="text-[10px] text-surface-500">Top 5% Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-surface-900 dark:text-white">Everything you need to build your identity</h2>
            <p className="text-surface-500 max-w-2xl mx-auto text-lg">Stop wrestling with generic website builders. CodeFolio is purpose-built for software engineers.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <RocketLaunchIcon className="w-10 h-10" />, title: 'Interactive Resumes', desc: 'Go beyond static PDFs. Showcase your experience timeline with measurable impact and deep tech stacks.' },
              { icon: <BeakerIcon className="w-6 h-6" />, title: 'Developer DNA', desc: 'Our engine analyzes your skills to visually map your exact developer archetype and core strengths.' },
              { icon: <BoltIcon className="w-6 h-6" />, title: 'Real-time Visual Editor', desc: 'Type your code, tweak your theme, and watch your portfolio update instantly in a live split-screen preview.' }
            ].map((feature, i) => (
              <div key={i} className="card p-8 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-inner">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-surface-900 dark:text-white">{feature.title}</h3>
                <p className="text-surface-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-surface-50 dark:bg-surface-950 -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 animate-slide-up gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black mb-4 text-surface-900 dark:text-white">Explore Premium Templates</h2>
              <p className="text-surface-500 max-w-xl text-lg">See our templates in action with live demo profiles. Hover over them to see the 3D depth effect.</p>
            </div>
            <Link to="/register" className="btn-secondary whitespace-nowrap">Try them out</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 perspective-[2000px]">
            {[
              { id: 'demo1', name: 'Minimal', desc: 'Clean, distraction-free typography focused on your work.', color: 'from-slate-300 to-slate-100' },
              { id: 'demo2', name: 'Terminal', desc: 'For the hackers. A monospace command-line experience.', color: 'from-green-500/20 to-green-900/20' },
              { id: 'demo3', name: 'Cyber Grid', desc: 'Neon aesthetics with intense CSS animations and gradients.', color: 'from-cyan-500 to-blue-500' },
              { id: 'demo4', name: 'Executive', desc: 'Multi-page tabbed layout for engineering leadership.', color: 'from-purple-500 to-primary-500' }
            ].map((demo, i) => (
              <a 
                key={demo.id} 
                href={`/${demo.id}`} 
                target="_blank"
                rel="noreferrer"
                className="group relative h-[300px] rounded-3xl overflow-hidden transition-all duration-500 transform-gpu hover:scale-105 hover:shadow-[0_20px_50px_rgba(99,102,241,0.3)] border border-surface-200 dark:border-surface-800"
                style={{ transformStyle: 'preserve-3d', transform: 'rotateX(5deg) rotateY(-5deg)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(50px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateX(5deg) rotateY(-5deg) translateZ(0)'; }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-20 dark:opacity-10 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-surface-100/50 dark:bg-surface-900/50 backdrop-blur-sm" />
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end transform-gpu transition-transform duration-500 group-hover:translate-z-[60px]" style={{ transform: 'translateZ(20px)' }}>
                  <div className="w-12 h-12 bg-white dark:bg-surface-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </div>
                  <h3 className="text-3xl font-black text-surface-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors drop-shadow-md">{demo.name}</h3>
                  <p className="text-surface-600 dark:text-surface-300 font-medium drop-shadow-sm">{demo.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
