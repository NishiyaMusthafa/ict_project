import Item from '../models/Item.js';
import Claim from '../models/Claim.js';

// @desc    Create a new lost or found item listing
// @route   POST /api/items
// @access  Private (Authenticated students only)
export const createItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      campusLocation,
      dateReported,
      type,
      imageUrl,
      contactInfo
    } = req.body;

    if (!title || !description || !category || !campusLocation || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (title, description, category, location, and type).'
      });
    }

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "lost" or "found".'
      });
    }

    const item = await Item.create({
      title: title.trim(),
      description: description.trim(),
      category,
      campusLocation: campusLocation.trim(),
      dateReported: dateReported || new Date(),
      type,
      status: 'open',
      imageUrl: imageUrl?.trim() || '',
      contactInfo: contactInfo?.trim() || '',
      postedBy: req.user._id
    });

    const populatedItem = await Item.findById(item._id).populate(
      'postedBy',
      'name email department'
    );

    return res.status(201).json({
      success: true,
      message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully!`,
      item: populatedItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Browse, search, and filter items with pagination
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      campusLocation,
      status,
      sort = 'newest',
      page = 1,
      limit = 9
    } = req.query;

    const query = {};

    // Filter by type (lost or found)
    if (type && ['lost', 'found'].includes(type)) {
      query.type = type;
    }

    // Filter by status (open, pending_return, resolved)
    if (status && ['open', 'pending_return', 'resolved'].includes(status)) {
      query.status = status;
    }

    // Filter by category
    if (category && category !== 'All Categories' && category !== 'all') {
      query.category = category;
    }

    // Filter by campus location
    if (campusLocation && campusLocation !== 'All Locations' && campusLocation !== 'all') {
      query.campusLocation = campusLocation;
    }

    // Search keyword in title or description
    if (search && search.trim() !== '') {
      const keywordRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: keywordRegex },
        { description: keywordRegex }
      ];
    }

    // Sort order
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'date_lost_newest') {
      sortOptions = { dateReported: -1 };
    }

    const currentPage = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 9;
    const skip = (currentPage - 1) * pageLimit;

    const [items, total] = await Promise.all([
      Item.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageLimit)
        .populate('postedBy', 'name department')
        .lean(),
      Item.countDocuments(query)
    ]);

    const pages = Math.ceil(total / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      count: items.length,
      pagination: {
        total,
        page: currentPage,
        pages,
        hasMore: currentPage < pages
      },
      items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item details by ID
// @route   GET /api/items/:id
// @access  Public (Optional auth for ownership and claims)
export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('postedBy', 'name email department phone role')
      .lean();

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    const currentUserId = req.user ? req.user._id.toString() : null;
    const isOwner = currentUserId && item.postedBy && item.postedBy._id.toString() === currentUserId;
    const isAdmin = req.user && req.user.role === 'admin';

    // Privacy protection: hide phone & sensitive contact info from non-owner/non-admin visitors
    const sanitizedItem = { ...item };
    if (!isOwner && !isAdmin) {
      if (sanitizedItem.postedBy) {
        sanitizedItem.postedBy = {
          _id: sanitizedItem.postedBy._id,
          name: sanitizedItem.postedBy.name,
          department: sanitizedItem.postedBy.department
        };
      }
      sanitizedItem.contactInfo = sanitizedItem.contactInfo
        ? 'Contact details visible once claim is initiated or approved.'
        : '';
    }

    // Check if current user has already submitted a claim on this item
    let userClaim = null;
    let claimsCount = 0;
    if (currentUserId) {
      userClaim = await Claim.findOne({ item: item._id, claimedBy: currentUserId }).lean();
    }
    claimsCount = await Claim.countDocuments({ item: item._id });

    return res.status(200).json({
      success: true,
      item: sanitizedItem,
      meta: {
        isOwner: Boolean(isOwner),
        isAdmin: Boolean(isAdmin),
        claimsCount,
        hasClaimed: Boolean(userClaim),
        userClaimStatus: userClaim ? userClaim.status : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing (Poster or Admin only)
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    // Authorization check: only owner or admin can update
    const isOwner = item.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this listing.'
      });
    }

    const {
      title,
      description,
      category,
      campusLocation,
      status,
      imageUrl,
      contactInfo
    } = req.body;

    if (title) item.title = title.trim();
    if (description) item.description = description.trim();
    if (category) item.category = category;
    if (campusLocation) item.campusLocation = campusLocation.trim();
    if (status && ['open', 'pending_return', 'resolved'].includes(status)) {
      item.status = status;
    }
    if (imageUrl !== undefined) item.imageUrl = imageUrl.trim();
    if (contactInfo !== undefined) item.contactInfo = contactInfo.trim();

    await item.save();

    const updated = await Item.findById(item._id).populate('postedBy', 'name email department');

    return res.status(200).json({
      success: true,
      message: 'Listing updated successfully.',
      item: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing (Poster or Admin only)
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

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
        message: 'You are not authorized to delete this listing.'
      });
    }

    // Delete associated claims
    await Claim.deleteMany({ item: item._id });

    // Delete item
    await Item.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Listing and related claims deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregate platform statistics for hero/dashboard
// @route   GET /api/items/stats/summary
// @access  Public
export const getPlatformStats = async (req, res, next) => {
  try {
    const [totalLost, totalFound, totalResolved, totalActive] = await Promise.all([
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: 'resolved' }),
      Item.countDocuments({ status: 'open' })
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalLost,
        totalFound,
        totalResolved,
        totalActive,
        successRate: totalFound + totalLost > 0
          ? Math.round((totalResolved / (totalFound + totalLost)) * 100)
          : 94 // friendly default placeholder when database is fresh
      }
    });
  } catch (error) {
    next(error);
  }
};
