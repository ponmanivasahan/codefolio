import { SparklesIcon } from "@heroicons/react/24/outline";
import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon = '<SparklesIcon className="w-4 h-4 inline-block mr-1" />', title, description, actionText, actionLink }) {
  return (
    <div className="card p-12 text-center animate-fade-in flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 bg-surface-50/50 dark:bg-surface-900/20">
      <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">{title}</h3>
      <p className="text-surface-500 max-w-sm mb-6">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
}