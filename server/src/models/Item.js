import mongoose from 'mongoose';

export const ITEM_CATEGORIES = [
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

export const CAMPUS_LOCATIONS = [
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

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ITEM_CATEGORIES
    },
    campusLocation: {
      type: String,
      required: [true, 'Campus location is required'],
      trim: true
    },
    dateReported: {
      type: Date,
      default: Date.now,
      required: [true, 'Date reported is required']
    },
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: [true, 'Type (lost or found) is required']
    },
    status: {
      type: String,
      enum: ['open', 'pending_return', 'resolved'],
      default: 'open'
    },
    imageUrl: {
      type: String,
      default: ''
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Posting user is required']
    },
    // Optional contact preference
    contactInfo: {
      type: String,
      trim: true,
      default: ''
    },
    // Track approved claim if resolved
    resolvedClaim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Search and filter indexes
itemSchema.index({ title: 'text', description: 'text' });
itemSchema.index({ type: 1, status: 1, category: 1, campusLocation: 1, createdAt: -1 });
itemSchema.index({ postedBy: 1 });

const Item = mongoose.model('Item', itemSchema);
export default Item;
