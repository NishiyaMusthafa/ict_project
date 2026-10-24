import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import User from '../models/User.js';

// @desc    Get complete administrative statistics & metrics
// @route   GET /api/admin/overview
// @access  Private/Admin
export const getAdminOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalItems,
      lostCount,
      foundCount,
      resolvedCount,
      openCount,
      totalClaims,
      pendingClaims,
      approvedClaims,
      rejectedClaims
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      Item.countDocuments(),
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: 'resolved' }),
      Item.countDocuments({ status: 'open' }),
      Claim.countDocuments(),
      Claim.countDocuments({ status: 'pending' }),
      Claim.countDocuments({ status: 'approved' }),
      Claim.countDocuments({ status: 'rejected' })
    ]);

    const resolutionRate = totalItems > 0 ? Math.round((resolvedCount / totalItems) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        users: { total: totalUsers, students: totalStudents, admins: totalAdmins },
        items: {
          total: totalItems,
          lost: lostCount,
          found: foundCount,
          resolved: resolvedCount,
          open: openCount,
          resolutionRate
        },
        claims: {
          total: totalClaims,
          pending: pendingClaims,
          approved: approvedClaims,
          rejected: rejectedClaims
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for moderation
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all listings for admin moderation (with filter by type or status)
// @route   GET /api/admin/items
// @access  Private/Admin
export const getAllItemsAdmin = async (req, res, next) => {
  try {
    const items = await Item.find()
      .populate('postedBy', 'name email department role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin moderate/remove listing
// @route   DELETE /api/admin/items/:id
// @access  Private/Admin
export const deleteInappropriateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    // Remove associated claims
    await Claim.deleteMany({ item: item._id });

    // Remove item
    await Item.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `Moderation action successful: Listing "${item.title}" removed.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims platform-wide for admin audit
// @route   GET /api/admin/claims
// @access  Private/Admin
export const getAllClaimsAdmin = async (req, res, next) => {
  try {
    const claims = await Claim.find()
      .populate('claimedBy', 'name email department')
      .populate('item', 'title category campusLocation type status')
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
