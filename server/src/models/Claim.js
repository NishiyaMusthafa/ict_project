import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item reference is required']
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Claiming user reference is required']
    },
    message: {
      type: String,
      required: [true, 'Claim explanation message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters detailing proof of ownership'],
      maxlength: [1500, 'Message cannot exceed 1500 characters']
    },
    proofDetails: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    responseNote: {
      type: String,
      trim: true,
      default: ''
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate claims for the same item by the same user
claimSchema.index({ item: 1, claimedBy: 1 }, { unique: true });
claimSchema.index({ claimedBy: 1, createdAt: -1 });
claimSchema.index({ item: 1, status: 1 });

const Claim = mongoose.model('Claim', claimSchema);
export default Claim;
