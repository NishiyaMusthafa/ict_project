import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Tag,
  Image as ImageIcon,
  X,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

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

export const ReportItemPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [type, setType] = useState('found'); // default 'found' or 'lost'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [campusLocation, setCampusLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [dateReported, setDateReported] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Handle local image file upload to /api/upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file must be under 5MB.');
      return;
    }

    // Set preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success && res.data.imageUrl) {
        setImageUrl(res.data.imageUrl);
        toast.success('Image uploaded successfully!');
      }
    } catch (err) {
      console.warn('Upload API fallback:', err.message);
      // Fallback: use reader data url if upload failed
      setImageUrl(reader.result);
      toast('Using local image preview mode', { icon: 'ℹ️' });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImageUrl('');
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || title.length < 4) {
      toast.error('Please enter a descriptive title (at least 4 characters).');
      return;
    }

    if (!description.trim() || description.length < 10) {
      toast.error('Please provide a detailed description (at least 10 characters).');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        campusLocation,
        dateReported,
        type,
        imageUrl: imageUrl.trim(),
        contactInfo: contactInfo.trim()
      };

      const res = await api.post('/items', payload);
      if (res.data?.success) {
        toast.success(res.data.message || 'Item reported successfully!');
        navigate(`/items/${res.data.item._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Campus Item
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Help reunite belongings by providing accurate details and campus locations.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lost vs Found Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Report Type *
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setType('found')}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  type === 'found'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Found an Item</span>
              </button>

              <button
                type="button"
                onClick={() => setType('lost')}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  type === 'lost'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>I Lost an Item</span>
              </button>
            </div>
          </div>

          {/* Item Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Item Title *
            </label>
            <input
              type="text"
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blue Hydro Flask 32oz, Apple AirPods Pro, Casio fx-991EX Calculator"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            />
            <p className="text-[10px] text-slate-400 mt-1 flex justify-between">
              <span>Be specific about brand, model, and primary color</span>
              <span>{title.length}/120</span>
            </p>
          </div>

          {/* Category & Location Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Campus Location *
              </label>
              <select
                value={campusLocation}
                onChange={(e) => setCampusLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Occurred */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Date {type === 'lost' ? 'Lost' : 'Found'} *
            </label>
            <input
              type="date"
              required
              value={dateReported}
              onChange={(e) => setDateReported(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe where it was seen/dropped, stickers, scratches, case color, wallpaper, or unique marks that can distinguish it from similar items..."
              className="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 leading-relaxed"
            />
            <p className="text-[10px] text-slate-400 mt-1">Minimum 10 characters.</p>
          </div>

          {/* Image Upload / URL */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Item Photo (Optional)
            </label>

            {imagePreview || imageUrl ? (
              <div className="relative w-40 h-40 rounded-2xl border border-slate-200 overflow-hidden group">
                <img
                  src={imagePreview || imageUrl}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 rounded-full bg-navy-950/70 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-violet-400 transition-colors bg-slate-50/50">
                <UploadCloud className="w-8 h-8 text-violet-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  Upload an image from your device
                </p>
                <p className="text-[11px] text-slate-400 mb-3">PNG, JPG, WebP up to 5MB</p>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-violet-600" />
                  {uploadingImage ? 'Uploading...' : 'Browse Image'}
                </label>
              </div>
            )}

            {/* Direct Image URL input option */}
            <div className="pt-1">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="Or paste an image web link (e.g. Unsplash or Cloudinary URL)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Contact or Handover instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pickup / Handover Instructions (Optional)
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="e.g., Kept at SAC Front Desk Room 102, or coordinate through LostLoop claims"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-200 transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting Report...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportItemPage;
