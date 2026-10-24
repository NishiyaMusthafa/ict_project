import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, MapPin, Mail, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-slate-400 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-900/50">
                <Sparkles className="w-5 h-5 text-violet-100" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Lost<span className="text-violet-400">Loop</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Lost something? Let's bring it back." The dedicated campus platform helping students report lost items, verify claims, and safely reunite belongings.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Campus Community Active</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore & Report
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/items" className="hover:text-violet-400 transition-colors">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/items?type=lost" className="hover:text-violet-400 transition-colors">
                  Lost Listings
                </Link>
              </li>
              <li>
                <Link to="/items?type=found" className="hover:text-violet-400 transition-colors">
                  Found Listings
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-violet-400 transition-colors">
                  Report a Found / Lost Item
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-violet-400 transition-colors">
                  My Claims & Activity
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Safety & Tips */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              Safety Guidelines
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>• Always verify specific marks or serial numbers before handing over items.</li>
              <li>• Meet during daylight hours at public campus spots (e.g. Student Center or Library front desk).</li>
              <li>• For wallets, IDs, or keys, verify student ID cards upon handover.</li>
            </ul>
          </div>

          {/* Campus Hubs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-violet-400" />
              Designated Drop-Offs
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>
                <strong className="text-slate-200">Main Campus Security:</strong><br />
                Administration Building, Ground Floor Room 102
              </p>
              <p>
                <strong className="text-slate-200">Library Circulation Desk:</strong><br />
                Main Library, Level 1 Lobby
              </p>
              <p>
                <strong className="text-slate-200">Student Affairs Helpdesk:</strong><br />
                Student Activity Center (SAC) Atrium
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LostLoop. Built for University Campus Evaluation.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with care for students and campus safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
