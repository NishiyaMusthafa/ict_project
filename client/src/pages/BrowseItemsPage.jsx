import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Tag,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../api/client';
import ItemCard from '../components/common/ItemCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const CATEGORIES = [
  'All Categories',
  'Electronics & Gadgets',
  'ID Cards & Wallets',
  'Keys & Locks',
  'Bags & Backpacks',
  'Books & Stationery',
  'Clothing & Apparel',
  'Bottles & Tumblers',
  'Sports Equipment',
  'Jewelry & Watches',
  'Other Items'
];

const LOCATIONS = [
  'All Locations',
  'Main Library',
  'Central Cafeteria / Food Court',
  'Student Activity Center (SAC)',
  'Engineering Block A',
  'Science Complex Block B',
  'Auditorium & Amphitheatre',
  'Indoor Sports Arena / Gym',
  'Football Field & Track',
  'Computer Center & Labs',
  'Campus Health Center',
  'Bus Bay & Parking Lot',
  'Hostel / Dormitory Area'
];

export const BrowseItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All Locations');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Synchronize state to URL & Fetch
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set('search', searchTerm.trim());
        if (selectedType !== 'all') params.set('type', selectedType);
        if (selectedCategory !== 'All Categories') params.set('category', selectedCategory);
        if (selectedLocation !== 'All Locations') params.set('campusLocation', selectedLocation);
        if (selectedStatus !== 'all') params.set('status', selectedStatus);
        params.set('sort', sortBy);
        params.set('page', page.toString());
        params.set('limit', '9');

        const res = await api.get(`/items?${params.toString()}`);
        if (res.data?.success) {
          setItems(res.data.items || []);
          setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 });
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please verify backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchTerm, selectedType, selectedCategory, selectedLocation, selectedStatus, sortBy, page]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('All Categories');
    setSelectedLocation('All Locations');
    setSelectedStatus('all');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm ||
    selectedType !== 'all' ||
    selectedCategory !== 'All Categories' ||
    selectedLocation !== 'All Locations' ||
    selectedStatus !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Campus Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search lost personal items or help return found belongings to their rightful owners.
          </p>
        </div>

        {/* Type Switcher Pills */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl w-fit self-start md:self-auto border border-slate-200/60">
          <button
            onClick={() => { setSelectedType('all'); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedType === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => { setSelectedType('lost'); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedType === 'lost'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Lost Only
          </button>
          <button
            onClick={() => { setSelectedType('found'); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedType === 'found'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Found Only
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by keywords, brand, color, or specific details..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-sm placeholder:text-slate-400 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(''); setPage(1); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Campus Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              <option value="all">All Statuses</option>
              <option value="open">Active / Open</option>
              <option value="pending_return">Pending Return</option>
              <option value="resolved">Reunited / Resolved</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              <option value="newest">Newest Listed First</option>
              <option value="date_lost_newest">Date Occurred (Recent)</option>
              <option value="oldest">Oldest Listed First</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 font-medium">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  Type: {selectedType.toUpperCase()}
                  <button onClick={() => setSelectedType('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCategory !== 'All Categories' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All Categories')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedLocation !== 'All Locations' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {selectedLocation}
                  <button onClick={() => setSelectedLocation('All Locations')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  Status: {selectedStatus}
                  <button onClick={() => setSelectedStatus('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors font-medium ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing {items.length} of {pagination.total} listings
        </span>
        <span>Page {pagination.page} of {pagination.pages}</span>
      </div>

      {/* Results Grid or State */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold"
          >
            Retry Connection
          </button>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No items found"
          description="We couldn't find any listings matching your active filters or keywords. Try resetting filters or report an item yourself!"
          actionText="Report an Item"
          actionLink="/report"
        />
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-semibold text-slate-700 px-4 py-2 rounded-xl bg-white border border-slate-200">
            Page {page} of {pagination.pages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page >= pagination.pages}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseItemsPage;
