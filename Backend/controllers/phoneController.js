const Phone = require("../models/Phone");
const Image = require("../models/Image");

// Controller to get all phones from the 'phonelisting' collection
module.exports.getPhones = async (req, res) => {
  try {
    const phones = await Phone.find(); // Find all phones
    res.json(phones); // Send the list of phones as JSON response
    console.log("Server Success =", phones);
  } catch (error) {
    console.log("Server Error", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports.getPhoneSeller = async (req, res) => {
  try {
    const phones = await Phone.find()
      .populate("seller", "firstname lastname email")
      .populate("reviews.reviewer", "firstname lastname");
    res.status(200).json(phones);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports.getPhoneById = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id)
      .populate("reviews.reviewer", "firstname lastname")
      .populate("seller", "firstname lastname email");

    if (!phone) {
      return res.status(404).json({ message: "Phone not found" });
    }

    res.status(200).json(phone);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getMyPhones = async (req, res) => {
  try {
    const sellerId = req.session.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const phones = await Phone.find({ seller: sellerId })
      .populate("seller", "firstname lastname email")
      .populate("reviews.reviewer", "firstname lastname");

    res.status(200).json(phones);
  } catch (error) {
    console.error("getMyPhones error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createPhone = async (req, res) => {
  try {
    const sellerId = req.session.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { title, brand, image, price, stock } = req.body;

    if (!title || !brand || !image || price == null || stock == null) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const phone = new Phone({
      title,
      brand,
      image,
      price,
      stock,
      seller: sellerId,
      disabled: false,
    });
    await phone.save();

    res.status(201).json(phone);
  } catch (err) {
    console.error("createPhone error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deletePhone = async (req, res) => {
  try {
    const sellerId = req.session.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const phone = await Phone.findById(req.params.id);
    if (!phone) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (phone.seller.toString() !== sellerId) {
      return res.status(403).json({
        message: "Forbidden: you can't delete someone else's listing",
      });
    }

    await Phone.findByIdAndDelete(req.params.id);
    return res.json({ message: "Listing deleted successfully." });
  } catch (err) {
    console.error("deletePhone error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.phoneEnableDisable = async (req, res) => {
  try {
    // Ensure user is logged in
    const sellerId = req.session.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    // Find the phone
    const phone = await Phone.findById(req.params.id);
    if (!phone) {
      return res.status(404).json({ message: "Listing not found." });
    }

    // Verify ownership
    if (phone.seller.toString() !== sellerId) {
      return res.status(403).json({
        message: "Forbidden: you can't modify someone else's listing",
      });
    }

    //Validate input
    if (typeof req.body.disabled !== "boolean") {
      return res.status(400).json({ message: "`disabled` must be a boolean." });
    }

    //Flip the flag
    phone.disabled = req.body.disabled;
    await phone.save();

    // Return the updated state
    return res.json({
      message: "Listing status updated.",
      phone: {
        _id: phone._id,
        disabled: phone.disabled,
      },
    });
  } catch (err) {
    console.error("updatePhone error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized User." });
  }

  try {
    const phone = await Phone.findById(req.params.phoneId);
    if (!phone) {
      return res.status(404).json({ message: "Phone not found" });
    }

    const alreadyReviewed = phone.reviews.find(
      (rev) => rev.reviewer.toString() === userId.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already submitted a review for this phone.",
      });
    }

    const newReview = {
      reviewer: userId,
      rating: Number(rating),
      comment,
    };

    phone.reviews.push(newReview);

    // Update average rating
    phone.rating =
      phone.reviews.reduce((acc, r) => acc + r.rating, 0) /
      phone.reviews.length;

    await phone.save();

    // Re-fetch with populated reviewer info
    const updatedPhone = await Phone.findById(req.params.phoneId).populate(
      "reviews.reviewer",
      "firstname lastname"
    );

    res.status(201).json({
      message: "Review added successfully",
      reviews: updatedPhone.reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding review",
      error: error.message,
    });
  }
};

module.exports.reviewerInfo = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.phoneId).populate(
      "reviews.reviewer",
      "firstname lastname"
    );
    if (!phone) {
      return res.status(404).json({ message: "Phone not found" });
    }
    res.json(phone.reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

exports.reduceStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const phone = await Phone.findById(id);
    if (!phone) return res.status(404).json({ message: "Phone not found" });

    if (phone.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    phone.stock -= quantity;
    await phone.save();

    res.status(200).json({ message: "Stock updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.toggleReviewHidden = async (req, res) => {
  try {
    const sellerId = req.session.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const { phoneId, reviewId } = req.params;
    const { hidden } = req.body;
    if (typeof hidden !== "boolean") {
      return res.status(400).json({ message: "`hidden` must be boolean." });
    }

    // load the phone
    const phone = await Phone.findById(phoneId);
    if (!phone) {
      return res.status(404).json({ message: "Listing not found." });
    }
    if (phone.seller.toString() !== sellerId) {
      return res
        .status(403)
        .json({ message: "Forbidden: cannot modify someone else's listing" });
    }

    // modify the subdoc
    const review = phone.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }
    review.hidden = hidden;
    await phone.save();

    // re-fetch just this review with populated reviewer
    const updated = await Phone.findById(phoneId)
      .populate("reviews.reviewer", "firstname lastname")
      .lean();

    const updatedReview = updated.reviews.find(
      (r) => r._id.toString() === reviewId
    );
    return res.json({
      message: "Review visibility updated",
      review: updatedReview,
    });
  } catch (err) {
    console.error("toggleReviewHidden error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports.getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set("Content-Type", image.contentType);
    res.send(image.data); // send raw image buffer
  } catch (error) {
    console.error("Error fetching image by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getImageByName = async (req, res) => {
  try {
    const image = await Image.findOne({ name: req.params.name });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error("Error fetching image by name:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.toggleOwnReviewHidden = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const { phoneId, reviewId } = req.params;
    const { hidden } = req.body;

    if (typeof hidden !== "boolean") {
      return res.status(400).json({ message: "`hidden` must be boolean." });
    }

    const phone = await Phone.findById(phoneId);
    if (!phone) {
      return res.status(404).json({ message: "Phone listing not found." });
    }

    const review = phone.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (!review.reviewer || review.reviewer.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden: you can only modify your own review." });
    }

    review.hidden = hidden;
    await phone.save();

    // Fetch updated phone with populated reviewers (without .lean(), so we keep document methods)
    const updated = await Phone.findById(phoneId).populate("reviews.reviewer", "firstname lastname");

    const updatedReview = updated.reviews.find(
      (r) => r._id?.toString() === reviewId
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Updated review not found after save." });
    }

    return res.json({
      message: "Review visibility updated by user",
      review: updatedReview,
    });
  } catch (err) {
    console.error("toggleOwnReviewHidden error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};


