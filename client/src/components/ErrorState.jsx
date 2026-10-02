import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import React from 'react';

export default function ErrorState({ title = "Something went wrong", message = "We couldn't load this data. Please try again.", onRetry }) {
  return (
    <div className="card p-8 text-center border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
        <ExclamationTriangleIcon className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-2">{title}</h3>
      <p className="text-red-600 dark:text-red-300 text-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-sm">Try Again</button>
      )}
    </div>
  );
}