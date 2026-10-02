import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';

export default function CommandCenter() {
  const { user } = useOutletContext();
  const profile = user?.profile;

  // Calculate Portfolio Score 2.0
  const score = React.useMemo(() => {
    let s = 0;
    if (profile?.displayName) s += 15;
    if (profile?.headline) s += 10;
    if (profile?.bio) s += 15;
    if (profile?.githubUsername) s += 10;
    if (user?.projects?.length > 0) s += 20;
    if (user?.projects?.some(p => p.liveUrl)) s += 10;
    if (user?.skills?.length >= 3) s += 20;
    return s;
  }, [user]);

  // Smart Recommendations
  const recommendations = [];
  if (!profile?.bio) recommendations.push({ msg: 'Your About section is missing.', action: 'Add a Bio', link: '/dashboard/profile' });
  if (user?.projects?.length === 0) recommendations.push({ msg: 'You have no projects listed.', action: 'Add Project', link: '/dashboard/projects' });
  else if (!user?.projects?.some(p => p.liveUrl)) recommendations.push({ msg: 'None of your projects have a live demo.', action: 'Add Live URL', link: '/dashboard/projects' });
  if (!profile?.githubUsername) recommendations.push({ msg: 'Your GitHub profile is missing.', action: 'Connect GitHub', link: '/dashboard/social-links' });
  if (user?.skills?.length < 3) recommendations.push({ msg: 'Add at least 3 skills to generate Developer DNA.', action: 'Add Skills', link: '/dashboard/skills' });

  if (recommendations.length === 0 && profile?.status === 'DRAFT') {
    recommendations.push({ msg: 'Your portfolio looks great!', action: 'Publish Now', link: '/dashboard/settings' });
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-surface-900 dark:text-white mb-2">Command Center</h1>
          <p className="text-surface-500">Welcome back, {user?.name.split(' ')[0]}. Here is your developer identity overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href={`/${profile?.username}`} target="_blank" className="btn-secondary">View Live Portfolio ↗</a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Portfolio Score Card */}
        <div className="card p-6 md:col-span-2 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" className="stroke-surface-100 dark:stroke-surface-800" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" className="stroke-primary-500" strokeWidth="8" strokeLinecap="round" strokeDasharray="283" strokeDashoffset={283 - (283 * score) / 100} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-surface-900 dark:text-white">{score}</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Portfolio Score</h2>
              <p className="text-surface-500 mb-4 max-w-sm">Your developer identity is {score}% complete. A higher score means better discoverability and stronger personal branding.</p>
              
              <div className="flex gap-2">
                <span className={`badge ${score >= 80 ? 'badge-primary' : ''}`}>Profile: {profile?.bio ? '100' : '40'}</span>
                <span className={`badge ${user?.projects?.length > 0 ? 'badge-primary' : ''}`}>Projects: {user?.projects?.length * 50}</span>
                <span className={`badge ${user?.skills?.length >= 3 ? 'badge-primary' : ''}`}>Skills: {user?.skills?.length >= 3 ? '100' : '0'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-rows-2 gap-6">
          <div className="card p-6 flex flex-col justify-center">
            <p className="text-sm font-bold text-surface-500 uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${profile?.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
              <span className="text-2xl font-black text-surface-900 dark:text-white">{profile?.status === 'PUBLISHED' ? 'Live' : 'Draft'}</span>
            </div>
          </div>
          <div className="card p-6 flex flex-col justify-center">
            <p className="text-sm font-bold text-surface-500 uppercase tracking-widest mb-1">Template</p>
            <span className="text-2xl font-black text-surface-900 dark:text-white capitalize">{profile?.template?.slug?.replace('-', ' ') || 'None'}</span>
          </div>
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Next Best Actions
        </h2>
        
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((rec, i) => (
              <div key={i} className="card p-5 flex items-center justify-between border-l-4 border-l-primary-500 hover:-translate-y-1 transition-transform">
                <span className="text-surface-600 dark:text-surface-300 font-medium">{rec.msg}</span>
                <Link to={rec.link} className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">{rec.action} →</Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🎉</div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">You are all set!</h3>
            <p className="text-surface-500">Your portfolio is highly optimized and complete. Keep building great things.</p>
          </div>
        )}
      </div>

    </div>
  );
}