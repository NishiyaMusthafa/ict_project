import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Inbox,
  Send,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Edit,
  MapPin,
  Calendar,
  AlertCircle,
  User,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'incoming', 'submitted'
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalPosts: 0,
      activePosts: 0,
      resolvedPosts: 0,
      pendingIncomingClaims: 0,
      myClaimsTotal: 0,
      approvedClaims: 0
    },
    myItems: [],
    incomingClaims: [],
    mySubmittedClaims: []
  });

  // Decision Modal state (Approve or Reject claim)
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [decisionAction, setDecisionAction] = useState('approve'); // 'approve' | 'reject'
  const [responseNote, setResponseNote] = useState('');
  const [processingDecision, setProcessingDecision] = useState(false);

  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle Approve / Reject claim
  const handleClaimDecision = async (e) => {
    e.preventDefault();
    if (!selectedClaim) return;

    try {
      setProcessingDecision(true);
      const res = await api.put(`/claims/${selectedClaim._id}/decision`, {
        action: decisionAction,
        responseNote: responseNote.trim()
      });

      if (res.data?.success) {
        toast.success(res.data.message || `Claim ${decisionAction}d!`);
        setDecisionModalOpen(false);
        setSelectedClaim(null);
        setResponseNote('');
        fetchDashboardData(); // Refresh data
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deciding claim.');
    } finally {
      setProcessingDecision(false);
    }
  };

  // Handle Delete Item
  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      const res = await api.delete(`/items/${itemToDelete._id}`);
      if (res.data?.success) {
        toast.success('Listing removed successfully.');
        setDeleteModalOpen(false);
        setItemToDelete(null);
        fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete listing.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-300 bg-violet-800/40 px-3 py-1 rounded-full border border-violet-700/50">
            Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage your reported campus items, verify incoming claims, and track your submitted claims.
          </p>
        </div>

        <Link
          to="/report"
          className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Report Another Item
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">My Posts</span>
            <Package className="w-4 h-4 text-violet-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{data.stats.totalPosts}</p>
          <p className="text-[11px] text-slate-400 mt-1">{data.stats.activePosts} currently active</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reunited</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">{data.stats.resolvedPosts}</p>
          <p className="text-[11px] text-slate-400 mt-1">Successfully closed loops</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Incoming Claims</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">{data.stats.pendingIncomingClaims}</p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting your verification</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Claims Filed</span>
            <Send className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-600">{data.stats.myClaimsTotal}</p>
          <p className="text-[11px] text-slate-400 mt-1">{data.stats.approvedClaims} approved & retrieved</p>
        </div>
      </div>

      {/* Tabs Controller */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'posts'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Reported Items ({data.myItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeTab === 'incoming'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Incoming Claims ({data.incomingClaims.length})</span>
            {data.stats.pendingIncomingClaims > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'submitted'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>My Submitted Claims ({data.mySubmittedClaims.length})</span>
          </button>
        </div>

        {/* Tab 1: My Reported Items */}
        {activeTab === 'posts' && (
          <div>
            {data.myItems.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-soft">
                <div className="divide-y divide-slate-100">
                  {data.myItems.map((item) => (
                    <div
                      key={item._id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100 font-bold text-xs uppercase">
                            {item.category?.slice(0, 3)}
                          </div>
                        )}

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge type={item.type} size="xs" />
                            <StatusBadge status={item.status} size="xs" />
                            <span className="text-[11px] text-slate-400">
                              Reported {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <Link
                            to={`/items/${item._id}`}
                            className="font-bold text-slate-900 hover:text-violet-600 transition-colors block text-sm"
                          >
                            {item.title}
                          </Link>

                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {item.campusLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <Link
                          to={`/items/${item._id}`}
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all text-xs font-semibold flex items-center gap-1"
                          title="View listing"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">View</span>
                        </Link>

                        <Link
                          to={`/items/${item._id}/edit`}
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all text-xs font-semibold flex items-center gap-1"
                          title="Edit listing"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>

                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all text-xs font-semibold flex items-center gap-1"
                          title="Delete listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="You haven't reported any items yet"
                description="Have you lost an item or found a belonging left behind on campus? Create a listing to close the loop!"
                actionText="Report an Item"
                actionLink="/report"
              />
            )}
          </div>
        )}

        {/* Tab 2: Incoming Claims */}
        {activeTab === 'incoming' && (
          <div>
            {data.incomingClaims.length > 0 ? (
              <div className="space-y-4">
                {data.incomingClaims.map((claim) => (
                  <div
                    key={claim._id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Claim for Item</span>
                        <Link
                          to={`/items/${claim.item?._id}`}
                          className="font-bold text-slate-900 text-sm hover:text-violet-600 transition-colors block"
                        >
                          {claim.item?.title || 'Unknown Item'}
                        </Link>
                      </div>
                      <StatusBadge status={claim.status} />
                    </div>

                    {/* Claimant Info */}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-xs">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 font-bold flex items-center justify-center">
                        {claim.claimedBy?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{claim.claimedBy?.name}</p>
                        <p className="text-slate-500">{claim.claimedBy?.email} • {claim.claimedBy?.department}</p>
                      </div>
                    </div>

                    {/* Claim Message / Proof */}
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-700">Claimant's Proof of Ownership:</p>
                      <p className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 text-slate-700 leading-relaxed">
                        "{claim.message}"
                      </p>
                      {claim.proofDetails && (
                        <p className="text-[11px] text-slate-500 pt-1">
                          <strong>Additional details:</strong> {claim.proofDetails}
                        </p>
                      )}
                    </div>

                    {/* Response Note if decided */}
                    {claim.responseNote && (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200">
                        <strong>Decision Note:</strong> {claim.responseNote}
                      </div>
                    )}

                    {/* Actions if Pending */}
                    {claim.status === 'pending' && (
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => {
                            setSelectedClaim(claim);
                            setDecisionAction('reject');
                            setDecisionModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold transition-colors"
                        >
                          Reject Claim
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClaim(claim);
                            setDecisionAction('approve');
                            setDecisionModalOpen(true);
                          }}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve Claim
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Inbox}
                title="No incoming claims yet"
                description="When someone files a claim on one of your found item posts with proof of ownership, it will appear here for your review."
              />
            )}
          </div>
        )}

        {/* Tab 3: My Submitted Claims */}
        {activeTab === 'submitted' && (
          <div>
            {data.mySubmittedClaims.length > 0 ? (
              <div className="space-y-4">
                {data.mySubmittedClaims.map((claim) => (
                  <div
                    key={claim._id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Claim for</span>
                        <Link
                          to={`/items/${claim.item?._id}`}
                          className="font-bold text-slate-900 text-sm hover:text-violet-600 transition-colors block"
                        >
                          {claim.item?.title || 'Campus Item'}
                        </Link>
                      </div>
                      <StatusBadge status={claim.status} />
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-slate-600">Your Submitted Statement:</p>
                      <p className="p-3 bg-slate-50 rounded-xl text-slate-700 italic border border-slate-100">
                        "{claim.message}"
                      </p>
                    </div>

                    {/* Feedback if approved or rejected */}
                    {claim.responseNote && (
                      <div className={`p-3 rounded-xl text-xs border ${
                        claim.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        <strong>Finder's Note:</strong> {claim.responseNote}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span>Submitted on {new Date(claim.createdAt).toLocaleDateString()}</span>
                      <Link
                        to={`/items/${claim.item?._id}`}
                        className="text-violet-600 font-semibold hover:underline"
                      >
                        View Item Post →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Send}
                title="You haven't submitted any claims yet"
                description="If you see a found item in the directory that belongs to you, open its details page and submit a claim with identifying details."
                actionText="Explore Found Items"
                actionLink="/items?type=found"
              />
            )}
          </div>
        )}
      </div>

      {/* Claim Decision Modal (Approve or Reject) */}
      <Modal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        title={decisionAction === 'approve' ? 'Approve Claim & Reunite Item' : 'Reject Claim'}
      >
        <form onSubmit={handleClaimDecision} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {decisionAction === 'approve'
              ? `You are confirming that ${selectedClaim?.claimedBy?.name} provided valid proof of ownership for "${selectedClaim?.item?.title}". This will mark the item as Reunited and reject conflicting pending claims.`
              : `You are rejecting the claim submitted by ${selectedClaim?.claimedBy?.name}.`}
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Note to Claimant (Optional)
            </label>
            <input
              type="text"
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              placeholder={
                decisionAction === 'approve'
                  ? 'e.g., Verified proof! Meet me at Library front desk at 2 PM.'
                  : 'e.g., Proof details did not match this item.'
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDecisionModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processingDecision}
              className={`px-5 py-2 rounded-xl text-white text-xs font-bold disabled:opacity-50 ${
                decisionAction === 'approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {processingDecision ? 'Processing...' : `Confirm ${decisionAction === 'approve' ? 'Approval' : 'Rejection'}`}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Item Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Listing"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete listing <strong>"{itemToDelete?.title}"</strong>? All associated claim records will be removed.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteItem}
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
            >
              Delete Listing
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
