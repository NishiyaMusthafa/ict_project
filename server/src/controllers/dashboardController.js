import Item from '../models/Item.js';
import Claim from '../models/Claim.js';

// @desc    Get aggregated student dashboard data
// @route   GET /api/dashboard
// @access  Private
export const getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. My posted items
    const myItems = await Item.find({ postedBy: userId })
      .sort({ createdAt: -1 })
      .lean();

    const itemIds = myItems.map(item => item._id);

    // 2. Incoming claims for any item posted by this user
    const incomingClaims = await Claim.find({ item: { $in: itemIds } })
      .populate('claimedBy', 'name email department phone')
      .populate('item', 'title category campusLocation type status')
      .sort({ createdAt: -1 })
      .lean();

    // 3. Claims this user submitted for other items
    const mySubmittedClaims = await Claim.find({ claimedBy: userId })
      .populate({
        path: 'item',
        populate: {
          path: 'postedBy',
          select: 'name email department phone'
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    // 4. Compute personal statistics
    const totalPosts = myItems.length;
    const activePosts = myItems.filter(i => i.status === 'open').length;
    const resolvedPosts = myItems.filter(i => i.status === 'resolved').length;
    const pendingIncomingClaims = incomingClaims.filter(c => c.status === 'pending').length;
    const approvedClaims = mySubmittedClaims.filter(c => c.status === 'approved').length;

    return res.status(200).json({
      success: true,
      stats: {
        totalPosts,
        activePosts,
        resolvedPosts,
        pendingIncomingClaims,
        myClaimsTotal: mySubmittedClaims.length,
        approvedClaims
      },
      myItems,
      incomingClaims,
      mySubmittedClaims
    });
  } catch (error) {
    next(error);
  }
};
