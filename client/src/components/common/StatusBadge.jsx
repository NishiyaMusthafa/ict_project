import React from 'react';
import { AlertCircle, CheckCircle2, Clock, HelpCircle, XCircle } from 'lucide-react';

export const StatusBadge = ({ type, status, size = 'sm' }) => {
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  // Item Type (Lost vs Found)
  if (type) {
    if (type === 'lost') {
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-rose-50 text-rose-700 border border-rose-200/60 ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>Lost Item</span>
        </span>
      );
    }
    if (type === 'found') {
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Found Item</span>
        </span>
      );
    }
  }

  // Item Status (Open, Pending Return, Resolved)
  if (status === 'open') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200/60 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse"></span>
        <span>Open</span>
      </span>
    );
  }

  if (status === 'pending_return') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 ${sizeClasses}`}>
        <Clock className="w-3.5 h-3.5 text-amber-500" />
        <span>Pending Return</span>
      </span>
    );
  }

  if (status === 'resolved') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 ${sizeClasses}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
        <span>Reunited</span>
      </span>
    );
  }

  // Claim Status (Pending, Approved, Rejected)
  if (status === 'pending') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Claim Pending</span>
      </span>
    );
  }

  if (status === 'approved') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Claim Approved</span>
      </span>
    );
  }

  if (status === 'rejected') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
        <XCircle className="w-3.5 h-3.5 text-slate-400" />
        <span>Claim Rejected</span>
      </span>
    );
  }

  return null;
};

export default StatusBadge;
