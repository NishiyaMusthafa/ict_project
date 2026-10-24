import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto border border-violet-100 shadow-sm">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <span className="text-4xl font-extrabold text-slate-900">404</span>
        <h1 className="text-xl font-bold text-slate-800">Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Looks like this page took a wrong turn across campus. Let's get you back on track!
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
