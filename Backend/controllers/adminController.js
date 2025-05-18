const User = require('../models/User');
const Phone = require('../models/Phone');
const bcrypt = require("bcrypt");

exports.getPaginatedUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortField = "firstname",
      sortOrder = "asc"
    } = req.query;

    const query = search
      ? {
          $or: [
            { firstname: { $regex: search, $options: "i" } },
            { lastname: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const sortOptions = {
      [sortField]: sortOrder === "desc" ? -1 : 1,
    };

    const [users, total] = await Promise.all([
      User.find(query).sort(sortOptions).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);
    res.json({
      data: users,
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { firstname, lastname, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { firstname, lastname, email },
      { new: true } // return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.toggleUserDisable = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Toggle disable state
    if (user.disabled) {
      user.disabled = undefined; // Remove field to enable user
    } else {
      user.disabled = true; // Disable user
    }

    await user.save();

    res.json({
      message: `User has been ${user.disabled ? 'disabled' : 'enabled'}`,
      user,
    });
  } catch (error) {
    console.error('Error toggling user disable:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getPaginatedPhones = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", brand = "", maxPrice = "" } = req.query;

    const query = {};

    // Search (title or brand)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Brand filter (case-insensitive exact match)
    if (brand) {
      query.brand = { $regex: `^${brand}$`, $options: "i" };
    }

    // Max price filter
    if (maxPrice && !isNaN(maxPrice)) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }

    const skip = (page - 1) * limit;

    const [phones, total] = await Promise.all([
      Phone.find(query).skip(skip).limit(Number(limit)),
      Phone.countDocuments(query),
    ]);

    const enrichedPhones = phones.map((phone) => {
      const ratings = phone.reviews || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
          : null;

      return {
        _id: phone._id,
        title: phone.title,
        brand: phone.brand,
        image: phone.image,
        stock: phone.stock,
        price: phone.price,
        seller: phone.seller,
        avgRating,
      };
    });

    res.json({
      data: enrichedPhones,
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.updatePhone = async (req, res) => {
  const phoneId = req.params.id;
  const { brand, title, stock, price } = req.body;

  try {
    const phone = await Phone.findByIdAndUpdate(
      phoneId,
      { brand, title, stock, price },
      { new: true } // return the updated document
    );

    if (!phone) {
      return res.status(404).json({ message: "Phone not found." });
    }

    res.status(200).json({ message: "Phone updated successfully", data: phone });
  } catch (err) {
    console.error("Error updating phone:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.togglePhoneDisable = async (req, res) => {
  try {
    const { id } = req.params;

    const phone = await Phone.findById(id);
    if (!phone) return res.status(404).json({ message: "Phone not found" });

    // Toggle disabled state
    phone.disabled = phone.disabled ? undefined : true;

    await phone.save();

    res.json({
      message: `Phone has been ${phone.disabled ? "disabled" : "enabled"}`,
      phone,
    });
  } catch (error) {
    console.error("Error toggling phone disable:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePhone = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPhone = await Phone.findByIdAndDelete(id);

    if (!deletedPhone) {
      return res.status(404).json({ message: "Phone not found" });
    }

    res.json({ message: "Phone deleted successfully", phone: deletedPhone });
  } catch (error) {
    console.error("Error deleting phone:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getModeratedReviews = async (req, res) => {
  try {
    const { searchTitle = '', searchReviewer = '', searchComment = '', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const basePipeline = [
      { $unwind: '$reviews' },
      {
        $addFields: {
          'reviews.reviewerObjectId': {
            $toObjectId: '$reviews.reviewer',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'reviews.reviewerObjectId',
          foreignField: '_id',
          as: 'reviewerInfo',
        },
      },
      { $unwind: '$reviewerInfo' },
      {
        $match: {
          ...(searchTitle && {
            title: { $regex: searchTitle, $options: 'i' },
          }),
          ...(searchComment && {
            'reviews.comment': { $regex: searchComment, $options: 'i' },
          }),
          ...(searchReviewer && {
            $or: [
              { 'reviewerInfo.firstname': { $regex: searchReviewer, $options: 'i' } },
              { 'reviewerInfo.lastname': { $regex: searchReviewer, $options: 'i' } },
            ],
          }),
        },
      },
    ];

    const dataPipeline = [
      ...basePipeline,
      {
        $project: {
          _id: '$reviews._id',
          hidden: '$reviews.hidden',
          phoneId: '$_id',
          phoneTitle: '$title',
          rating: '$reviews.rating',
          comment: '$reviews.comment',
          reviewer: '$reviews.reviewer',
          reviewerName: {
            $concat: ['$reviewerInfo.firstname', ' ', '$reviewerInfo.lastname'],
          },
        },
      },
      { $skip: skip },
      { $limit: Number(limit) },
    ];

    const countPipeline = [
      ...basePipeline,
      { $count: 'total' },
    ];

    const [reviews, totalCount] = await Promise.all([
      Phone.aggregate(dataPipeline),
      Phone.aggregate(countPipeline),
    ]);

    const total = totalCount[0]?.total || 0;

    res.json({
      data: reviews,
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.toggleReviewHidden = async (req, res) => {
  const { phoneId, reviewerId } = req.params;

  try {
    // First, find the specific review to check its current hidden state
    const phone = await Phone.findOne({ _id: phoneId, "reviews.reviewer": reviewerId });
    if (!phone) {
      return res.status(404).json({ message: "Phone or review not found." });
    }

    const review = phone.reviews.find(r => r.reviewer.toString() === reviewerId);
    const isHidden = !!review.hidden;

    // Use positional operator `$` to update the matching review inside the array
    const update = isHidden
      ? { $unset: { "reviews.$.hidden": "" } }
      : { $set: { "reviews.$.hidden": true } };

    await Phone.findOneAndUpdate(
      { _id: phoneId, "reviews.reviewer": reviewerId },
      update
    );

    res.status(200).json({
      message: `Review has been ${isHidden ? "unhidden" : "hidden"}.`
    });
  } catch (err) {
    console.error("Error toggling review hidden status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



