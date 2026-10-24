import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Package,
  Inbox,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('items'); // 'items', 'users', 'claims'
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);

  // Search filter inside tables
  const [filterText, setFilterText] = useState('');

  // Delete Item Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [overviewRes, itemsRes, usersRes, claimsRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/items'),
        api.get('/admin/users'),
        api.get('/admin/claims')
      ]);

      if (overviewRes.data?.stats) setStats(overviewRes.data.stats);
      if (itemsRes.data?.items) setItems(itemsRes.data.items);
      if (usersRes.data?.users) setUsers(usersRes.data.users);
      if (claimsRes.data?.claims) setClaims(claimsRes.data.claims);
    } catch (err) {
      console.error('Failed to load admin resources:', err);
      toast.error('Could not load administrative console data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAdminDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/admin/items/${itemToDelete._id}`);
      if (res.data?.success) {
        toast.success(res.data.message || 'Listing moderated and removed.');
        setDeleteModalOpen(false);
        setItemToDelete(null);
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Moderation action failed.');
    } finally {
      setDeleting(false);
    }
  };

  // Filtered lists
  const filteredItems = items.filter(
    (i) =>
      i.title.toLowerCase().includes(filterText.toLowerCase()) ||
      i.campusLocation.toLowerCase().includes(filterText.toLowerCase()) ||
      i.category.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filterText.toLowerCase()) ||
      u.email.toLowerCase().includes(filterText.toLowerCase()) ||
      u.department?.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredClaims = claims.filter(
    (c) =>
      c.item?.title?.toLowerCase().includes(filterText.toLowerCase()) ||
      c.claimedBy?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      c.message.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-navy-950 to-navy-900 rounded-3xl p-6 sm:p-8 text-white shadow-elevated border border-purple-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administrative Moderation Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Campus Oversight & Safety
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Review listings, eliminate spam or inappropriate submissions, audit campus claims, and oversee user activity.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md shadow-purple-900/50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Stats
        </button>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Campus Users</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.users.total}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.users.students} students, {stats.users.admins} admins</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Listings</span>
            <p className="text-2xl font-extrabold text-violet-600 mt-1">{stats.items.total}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.items.lost} lost, {stats.items.found} found</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Resolution Rate</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.items.resolutionRate}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.items.resolved} reunited items</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Claims Oversight</span>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">{stats.claims.total}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.claims.pending} pending, {stats.claims.approved} approved</p>
          </div>
        </div>
      )}

      {/* Admin Tabs & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('items')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'items'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Listing Moderation ({items.length})
            </button>

            <button
              onClick={() => setActiveTab('claims')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'claims'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              Campus Claims ({claims.length})
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'users'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              User Directory ({users.length})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search table..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
            />
          </div>
        </div>

        {/* Tab 1: Listing Moderation */}
        {activeTab === 'items' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Item Title</th>
                  <th className="py-3 px-3">Type & Status</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Reported By</th>
                  <th className="py-3 px-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3 max-w-[220px]">
                      <p className="font-bold text-slate-900 truncate" title={item.title}>
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge type={item.type} size="xs" />
                        <StatusBadge status={item.status} size="xs" />
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                      {item.category}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                      {item.campusLocation}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <p className="font-semibold text-slate-800">{item.postedBy?.name || 'Deleted User'}</p>
                      <p className="text-[10px] text-slate-400">{item.postedBy?.email}</p>
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/items/${item._id}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          title="View listing"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                          title="Remove listing (spam / inappropriate)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Campus Claims Oversight */}
        {activeTab === 'claims' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Item</th>
                  <th className="py-3 px-3">Claimant</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Claim Proof Statement</th>
                  <th className="py-3 px-3">Date Filed</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClaims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3 max-w-[200px]">
                      <p className="font-bold text-slate-900 truncate">{claim.item?.title || 'Unknown'}</p>
                      <span className="text-[10px] text-slate-400">{claim.item?.campusLocation}</span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <p className="font-semibold text-slate-800">{claim.claimedBy?.name}</p>
                      <p className="text-[10px] text-slate-400">{claim.claimedBy?.email}</p>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <StatusBadge status={claim.status} size="xs" />
                    </td>

                    <td className="py-3.5 px-3 max-w-[300px]">
                      <p className="text-slate-600 line-clamp-2 italic">"{claim.message}"</p>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-400">
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <Link
                        to={`/items/${claim.item?._id}`}
                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold text-[11px]"
                      >
                        Inspect <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Users Directory */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Student / User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600">
                      {u.department || 'General'}
                    </td>

                    <td className="py-3.5 px-3 text-slate-500">
                      {u.phone || '—'}
                    </td>

                    <td className="py-3.5 px-3 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete / Spam Moderation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Admin Moderation: Remove Listing"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
            <p className="font-bold">⚠️ Warning: Administrative Action</p>
            <p className="mt-0.5">
              You are removing <strong>"{itemToDelete?.title}"</strong> posted by {itemToDelete?.postedBy?.name}. This will also purge all submitted claims.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAdminDelete}
              disabled={deleting}
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50"
            >
              {deleting ? 'Moderating...' : 'Permanently Delete Post'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;
