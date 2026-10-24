import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Tag,
  User,
  Shield,
  Edit,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Share2,
  Phone,
  Mail,
  Lock,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { getCategoryIcon } from '../components/common/ItemCard';

export const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [meta, setMeta] = useState({ isOwner: false, isAdmin: false, claimsCount: 0, hasClaimed: false, userClaimStatus: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Claim Modal state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/items/${id}`);
      if (res.data?.success) {
        setItem(res.data.item);
        setMeta(res.data.meta || {});
      }
    } catch (err) {
      console.error('Error fetching item details:', err);
      setError(err.response?.data?.message || 'Listing not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id, user]);

  // Submit Claim Handler
  const handleClaimSubmit = async (e) => {
    e.preventDefault();

    if (!claimMessage.trim() || claimMessage.trim().length < 10) {
      toast.error('Please describe identifying proof in at least 10 characters.');
      return;
    }

    try {
      setSubmittingClaim(true);
      const res = await api.post('/claims', {
        itemId: item._id,
        message: claimMessage.trim(),
        proofDetails: proofDetails.trim()
      });

      if (res.data?.success) {
        toast.success('Claim submitted successfully! The poster will review your claim.');
        setClaimModalOpen(false);
        setClaimMessage('');
        setProofDetails('');
        fetchItemDetails(); // Refresh meta state
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit claim.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  // Delete Item Handler
  const handleDeleteItem = async () => {
    try {
      setDeleting(true);
      const res = await api.delete(`/items/${item._id}`);
      if (res.data?.success) {
        toast.success('Listing deleted successfully.');
        navigate('/items');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete listing.');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  // Copy shareable link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Listing link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-semibold text-slate-500">Retrieving item details from database...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{error || 'Item Not Found'}</h2>
        <p className="text-xs text-slate-500">
          The requested listing may have been resolved, removed, or the link is incorrect.
        </p>
        <Link
          to="/items"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>
      </div>
    );
  }

  const formattedDate = item.dateReported
    ? new Date(item.dateReported).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Unknown date';

  const canClaim =
    isAuthenticated &&
    item.type === 'found' &&
    item.status === 'open' &&
    !meta.isOwner &&
    !meta.hasClaimed;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <Link
          to="/items"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all listings
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share Listing
        </button>
      </div>

      {/* Main Grid: Left Media & Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Photo / Fallback Visual */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-3 shadow-soft overflow-hidden">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-violet-50/80 via-slate-50 to-indigo-50/60 w-full h-full">
                  <div className="p-4 rounded-2xl bg-white shadow-sm border border-violet-100 mb-3">
                    {getCategoryIcon(item.category, "w-12 h-12 text-violet-600")}
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                    No photo attached by reporter. Review the description for identifying marks.
                  </p>
                </div>
              )}

              {/* Status Overlay */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <StatusBadge type={item.type} />
                <StatusBadge status={item.status} />
              </div>
            </div>
          </div>

          {/* Quick Safety Guidelines Card */}
          <div className="bg-violet-50/60 border border-violet-100 rounded-2xl p-4 text-xs text-violet-900 space-y-1.5">
            <p className="font-semibold flex items-center gap-1 text-violet-800">
              <Shield className="w-3.5 h-3.5" />
              Campus Safety Reminder
            </p>
            <p className="text-violet-700/90 leading-relaxed text-[11px]">
              Meet at high-traffic, well-lit campus zones (such as Campus Security, Main Library circulation counter, or Student Center lobby).
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): Full Listing Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="inline-flex items-center gap-1 font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
                  <Tag className="w-3.5 h-3.5" />
                  {item.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formattedDate}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {item.title}
              </h1>
            </div>

            {/* Location & Reported date callouts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-white shadow-xs text-violet-600 border border-slate-200/60">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Campus Location</p>
                  <p className="font-bold text-slate-900 mt-0.5">{item.campusLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-white shadow-xs text-violet-600 border border-slate-200/60">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Reported On</p>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Description & Distinguishing Features
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/40 p-4 rounded-2xl border border-slate-100">
                {item.description}
              </p>
            </div>

            {/* Poster Information (Privacy Guarded) */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Reported By
              </h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm">
                    {item.postedBy?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {item.postedBy?.name || 'Campus Student'}
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified Student
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      {item.postedBy?.department || 'University Student'}
                    </p>
                  </div>
                </div>

                {/* Show contact only if owner/admin */}
                {(meta.isOwner || meta.isAdmin) && item.postedBy?.email && (
                  <div className="text-right text-xs">
                    <p className="text-slate-500 font-medium">{item.postedBy.email}</p>
                    {item.postedBy.phone && <p className="text-slate-500">{item.postedBy.phone}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Actions Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              {/* If Poster/Admin: Show Edit & Delete */}
              {meta.isOwner || meta.isAdmin ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={`/items/${item._id}/edit`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Listing
                  </Link>

                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Listing
                  </button>

                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-all ml-auto"
                  >
                    View Claims on Dashboard ({meta.claimsCount})
                  </Link>
                </div>
              ) : null}

              {/* Found Item Claim Buttons for Non-Owners */}
              {!meta.isOwner && item.type === 'found' && (
                <div>
                  {item.status === 'resolved' ? (
                    <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                      <span>This item has been successfully claimed and reunited with its owner!</span>
                    </div>
                  ) : meta.hasClaimed ? (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>You submitted a claim for this item.</span>
                      </div>
                      <StatusBadge status={meta.userClaimStatus} />
                    </div>
                  ) : isAuthenticated ? (
                    <button
                      onClick={() => setClaimModalOpen(true)}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-violet-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Claim for this Item</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span>Log in with your college account to submit a claim for this item.</span>
                      <Link
                        to="/login"
                        className="px-4 py-2 rounded-xl bg-violet-600 text-white font-semibold text-xs shrink-0"
                      >
                        Log In to Claim
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* If Lost Item: Give helpful tip */}
              {item.type === 'lost' && !meta.isOwner && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>
                    Did you find this lost item? You can report it as a <strong>Found Item</strong> or notify the campus security desk at {item.campusLocation}.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Claim Submission Modal */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="Submit Claim for Found Item"
      >
        <form onSubmit={handleClaimSubmit} className="space-y-4">
          <div className="p-3 bg-violet-50 rounded-xl border border-violet-100 text-xs text-violet-800">
            <p className="font-semibold">{item.title}</p>
            <p className="text-[11px] text-violet-600 mt-0.5">Found at {item.campusLocation}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Why does this item belong to you? *
            </label>
            <textarea
              required
              rows={4}
              value={claimMessage}
              onChange={(e) => setClaimMessage(e.target.value)}
              placeholder="Describe unique identifying features (e.g., specific stickers, lock screen photo, engraved initials, exact color of cable or keychain)..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            />
            <p className="text-[10px] text-slate-400 mt-1">Minimum 10 characters required for verification.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Serial Number or Additional Proof (Optional)
            </label>
            <input
              type="text"
              value={proofDetails}
              onChange={(e) => setProofDetails(e.target.value)}
              placeholder="e.g. Serial #, purchase receipt date, unique PIN format"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setClaimModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingClaim}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold disabled:opacity-50"
            >
              {submittingClaim ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Listing"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete this listing <strong>"{item.title}"</strong>? This will permanently remove the post and any associated claim history.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteItem}
              disabled={deleting}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete Listing'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ItemDetailsPage;
