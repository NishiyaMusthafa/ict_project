import Claim from '../models/Claim.js';
import Item from '../models/Item.js';

// @desc    Submit a claim for a found item
// @route   POST /api/claims
// @access  Private (Authenticated students)
export const submitClaim = async (req, res, next) => {
  try {
    const { itemId, message, proofDetails } = req.body;

    if (!itemId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and an explanation message are required to submit a claim.'
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 10 characters explaining unique identifying features of your item.'
      });
    }

    // Find the item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'The item you are attempting to claim does not exist.'
      });
    }

    // Only found items can be claimed (lost items are already reported by owners)
    if (item.type !== 'found') {
      return res.status(400).json({
        success: false,
        message: 'Claims can only be filed on items listed as "Found". If you found someone\'s lost item, report it as Found or contact campus security.'
      });
    }

    // Check if item is already resolved
    if (item.status === 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'This item has already been claimed and resolved.'
      });
    }

    // Prevent claiming own listing
    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot submit a claim for an item you posted yourself.'
      });
    }

    // Prevent duplicate claims by the same user for the same item
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimedBy: req.user._id
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: `You have already submitted a claim for this item. Current status: ${existingClaim.status.toUpperCase()}.`
      });
    }

    // Create claim
    const claim = await Claim.create({
      item: itemId,
      claimedBy: req.user._id,
      message: message.trim(),
      proofDetails: proofDetails?.trim() || '',
      status: 'pending'
    });

    const populatedClaim = await Claim.findById(claim._id)
      .populate('claimedBy', 'name email department phone')
      .populate('item', 'title category campusLocation type status');

    return res.status(201).json({
      success: true,
      message: 'Claim submitted successfully! The poster will review your claim and reach out.',
      claim: populatedClaim
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get claims submitted by the logged in user
// @route   GET /api/claims/my-claims
// @access  Private
export const getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ claimedBy: req.user._id })
      .populate({
        path: 'item',
        populate: {
          path: 'postedBy',
          select: 'name email department phone'
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      claims
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims on a specific item (Listing owner or Admin only)
// @route   GET /api/claims/item/:itemId
// @access  Private
export const getItemClaims = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    const isOwner = item.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the item poster or an administrator can view incoming claims.'
      });
    }

    const claims = await Claim.find({ item: req.params.itemId })
      .populate('claimedBy', 'name email department phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      claims
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject a claim (Listing owner or Admin only)
// @route   PUT /api/claims/:id/decision
// @access  Private
export const decideClaim = async (req, res, next) => {
  try {
    const { action, responseNote } = req.body; // 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "approve" or "reject".'
      });
    }

    const claim = await Claim.findById(req.params.id)
      .populate('item')
      .populate('claimedBy', 'name email department phone');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found.'
      });
    }

    const item = await Item.findById(claim.item._id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Associated item no longer exists.'
      });
    }

    // Only owner of the item or admin can decide
    const isOwner = item.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to make decisions on claims for this item.'
      });
    }

    // If claim was already decided
    if (claim.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This claim has already been ${claim.status}.`
      });
    }

    if (action === 'approve') {
      // Check if item was already resolved by another claim
      if (item.status === 'resolved') {
        return res.status(400).json({
          success: false,
          message: 'Another claim has already been approved for this item.'
        });
      }

      // Approve this claim
      claim.status = 'approved';
      claim.responseNote = responseNote?.trim() || 'Claim verified and approved by the finder.';
      claim.reviewedAt = new Date();
      await claim.save();

      // Update item status to resolved & link the approved claim
      item.status = 'resolved';
      item.resolvedClaim = claim._id;
      await item.save();

      // Reject all other pending claims on this item to prevent conflicts!
      await Claim.updateMany(
        { item: item._id, _id: { $ne: claim._id }, status: 'pending' },
        {
          status: 'rejected',
          responseNote: 'Another claimant provided verified proof of ownership for this item.',
          reviewedAt: new Date()
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Claim approved! Item marked as Resolved and reunited with owner.',
        claim,
        item
      });
    } else {
      // Reject claim
      claim.status = 'rejected';
      claim.responseNote = responseNote?.trim() || 'Claim could not be verified by the finder.';
      claim.reviewedAt = new Date();
      await claim.save();

      return res.status(200).json({
        success: true,
        message: 'Claim rejected.',
        claim
      });
    }
  } catch (error) {
    next(error);
  }
};
