import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Laptop,
  Key,
  CreditCard,
  Backpack,
  BookOpen,
  Shirt,
  Coffee,
  HelpCircle,
  Users
} from 'lucide-react';
import api from '../api/client';
import ItemCard from '../components/common/ItemCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const CATEGORIES = [
  { name: 'Electronics & Gadgets', icon: Laptop, color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { name: 'ID Cards & Wallets', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { name: 'Keys & Locks', icon: Key, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  { name: 'Bags & Backpacks', icon: Backpack, color: 'text-violet-600 bg-violet-50 border-violet-100' },
  { name: 'Books & Stationery', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { name: 'Clothing & Apparel', icon: Shirt, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  { name: 'Bottles & Tumblers', icon: Coffee, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
  { name: 'Other Items', icon: HelpCircle, color: 'text-slate-600 bg-slate-50 border-slate-100' },
];

export const HomePage = () => {
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    totalResolved: 0,
    totalActive: 0,
    successRate: 94
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, itemsRes] = await Promise.all([
          api.get('/items/stats/summary'),
          api.get('/items?limit=6&sort=newest')
        ]);

        if (statsRes.data?.stats) {
          setStats(statsRes.data.stats);
        }
        if (itemsRes.data?.items) {
          setRecentItems(itemsRes.data.items);
        }
      } catch (err) {
        console.warn('Could not load landing data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-violet-50/60 via-warm-white to-warm-white border-b border-slate-200/50 bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Campus Tag Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100/80 border border-violet-200 text-violet-800 text-xs font-semibold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>University Campus Lost & Found Network</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]"
            >
              Lost something? <br />
              <span className="gradient-text">Let's bring it back.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              LostLoop connects college students across campus buildings, lecture halls, and dorms. Report what you misplaced, browse found items, and claim your belongings with verified proof.
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <Link
                to="/items"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-md shadow-violet-200 hover:shadow-violet-300 transition-all flex items-center justify-center gap-2 group"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Items</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/report"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-violet-600" />
                <span>Report an Item</span>
              </Link>
            </motion.div>
          </div>

          {/* Live Platform Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-slate-200/80 shadow-soft text-center">
              <p className="text-3xl font-extrabold text-rose-600">{stats.totalLost}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Lost Items Reported</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-slate-200/80 shadow-soft text-center">
              <p className="text-3xl font-extrabold text-emerald-600">{stats.totalFound}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Found Belongings</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-slate-200/80 shadow-soft text-center">
              <p className="text-3xl font-extrabold text-violet-600">{stats.totalResolved}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Reunited With Owners</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-slate-200/80 shadow-soft text-center">
              <p className="text-3xl font-extrabold text-indigo-600">{stats.successRate}%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Return Success Rate</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3">How LostLoop Works</h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered specifically for busy students and campus safety desks to close the loop fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-soft hover:shadow-card transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 font-bold text-lg flex items-center justify-center mb-5">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Report with Specifics</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Post an item you lost or picked up. Include location (Library, SAC, Cafeteria), date, and distinguishing photos or stickers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-soft hover:shadow-card transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center mb-5">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Submit Claim & Proof</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Spot your item in the directory? Submit a claim explaining unique marks, wallpaper details, or serial numbers only the owner knows.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-soft hover:shadow-card transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg flex items-center justify-center mb-5">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Approve & Safely Reunite</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The finder reviews your claim. Once approved, coordinate a quick handover at a safe public campus spot like the Library circulation desk!
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore by Category</h2>
            <p className="text-xs text-slate-500 mt-1">Quickly narrow down what you are looking for</p>
          </div>
          <Link
            to="/items"
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/items?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-violet-300 shadow-soft hover:shadow-card transition-all flex flex-col items-center text-center"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 border group-hover:scale-110 transition-transform ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-violet-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recently Reported Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md">
              Live Feed
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">Recently Reported Campus Items</h2>
            <p className="text-xs text-slate-500 mt-1">Recent lost items and found belongings waiting for their owners</p>
          </div>
          <Link
            to="/items"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <span>Browse Complete Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
            <p className="text-sm text-slate-500">No items reported yet. Be the first to report!</p>
            <Link
              to="/report"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-violet-600 hover:underline"
            >
              Report an item now →
            </Link>
          </div>
        )}
      </section>

      {/* Campus Community Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-violet-900 via-navy-900 to-navy-950 rounded-3xl p-8 sm:p-12 text-white shadow-elevated relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-200 text-xs font-semibold border border-violet-400/30">
              <ShieldCheck className="w-4 h-4 text-violet-300" />
              Verified College Identity & Privacy Guarded
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              A Safer, Kind Campus Starts With Us.
            </h2>
            <p className="text-xs sm:text-sm text-violet-100/80 leading-relaxed">
              No more chaotic WhatsApp groups or cluttered physical bulletin boards. LostLoop provides a centralized, authenticated platform with built-in proof checks and admin moderation.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-semibold text-xs shadow-md transition-colors"
              >
                Join with College Email
              </Link>
              <Link
                to="/items"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur border border-white/20 transition-colors"
              >
                Search Campus Directory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
