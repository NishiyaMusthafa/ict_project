import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Tag, Laptop, Key, CreditCard, Backpack, BookOpen, Shirt, Coffee, HelpCircle, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

// Helper to pick category icon fallback
export const getCategoryIcon = (category, className = "w-8 h-8 text-violet-500") => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('elect') || cat.includes('gadget') || cat.includes('phone') || cat.includes('laptop')) {
    return <Laptop className={className} />;
  }
  if (cat.includes('key') || cat.includes('lock')) {
    return <Key className={className} />;
  }
  if (cat.includes('card') || cat.includes('wallet') || cat.includes('id')) {
    return <CreditCard className={className} />;
  }
  if (cat.includes('bag') || cat.includes('pack')) {
    return <Backpack className={className} />;
  }
  if (cat.includes('book') || cat.includes('note') || cat.includes('stationery')) {
    return <BookOpen className={className} />;
  }
  if (cat.includes('cloth') || cat.includes('apparel') || cat.includes('jacket')) {
    return <Shirt className={className} />;
  }
  if (cat.includes('bottle') || cat.includes('tumbler') || cat.includes('cup')) {
    return <Coffee className={className} />;
  }
  return <HelpCircle className={className} />;
};

export const ItemCard = ({ item }) => {
  if (!item) return null;

  const formattedDate = item.dateReported
    ? new Date(item.dateReported).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-violet-300 shadow-sm hover:shadow-card overflow-hidden flex flex-col h-full transition-colors duration-200"
    >
      {/* Image or Category Fallback Container */}
      <Link to={`/items/${item._id}`} className="relative h-48 w-full bg-slate-50 overflow-hidden block">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback visual if no image or image failed */}
        <div
          className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-50/70 via-slate-50 to-indigo-50/50 ${
            item.imageUrl ? 'hidden' : 'flex'
          }`}
        >
          <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-violet-100/80 mb-2 group-hover:scale-110 transition-transform duration-200">
            {getCategoryIcon(item.category, "w-8 h-8 text-violet-600")}
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.category}</span>
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <StatusBadge type={item.type} />
          {item.status !== 'open' && <StatusBadge status={item.status} />}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category Pill & Date */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
          <span className="inline-flex items-center gap-1 font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
            <Tag className="w-3 h-3" />
            {item.category}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <Link to={`/items/${item._id}`} className="block group-hover:text-violet-600 transition-colors">
          <h3 className="font-semibold text-slate-900 line-clamp-1 text-base leading-snug mb-1.5" title={item.title}>
            {item.title}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {item.description}
        </p>

        {/* Location & Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate max-w-[70%]" title={item.campusLocation}>
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.campusLocation}</span>
          </div>

          <Link
            to={`/items/${item._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 group-hover:translate-x-0.5 transition-transform"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
