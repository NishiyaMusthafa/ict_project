import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';

const CATEGORIES = [
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

const CAMPUS_LOCATIONS = [
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

export const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [campusLocation, setCampusLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [status, setStatus] = useState('open');
  const [imageUrl, setImageUrl] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        if (res.data?.success && res.data.item) {
          const item = res.data.item;
          setTitle(item.title || '');
          setDescription(item.description || '');
          setCategory(item.category || CATEGORIES[0]);
          setCampusLocation(item.campusLocation || CAMPUS_LOCATIONS[0]);
          setStatus(item.status || 'open');
          setImageUrl(item.imageUrl || '');
          setContactInfo(item.contactInfo || '');
        }
      } catch (err) {
        toast.error('Could not load listing details.');
        navigate('/items');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.put(`/items/${id}`, {
        title: title.trim(),
        description: description.trim(),
        category,
        campusLocation,
        status,
        imageUrl: imageUrl.trim(),
        contactInfo: contactInfo.trim()
      });

      if (res.data?.success) {
        toast.success('Listing updated successfully!');
        navigate(`/items/${id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-xs text-slate-500 font-medium">Loading listing details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Cancel and return
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card">
        <h1 className="text-xl font-bold text-slate-900 mb-6">Edit Listing Details</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Campus Location</label>
              <select
                value={campusLocation}
                onChange={(e) => setCampusLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              >
                {CAMPUS_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
            >
              <option value="open">Open / Active</option>
              <option value="pending_return">Pending Return</option>
              <option value="resolved">Reunited / Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemPage;
