const Phone = require("../models/Phone");

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

    // (Optional) Check if user already reviewed
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

module.exports.reduceStock = async (req, res) => {
  const phoneId = req.params.id;
  const { quantity } = req.body;
  console.log("Body:", req.body);
  if (typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    const phone = await Phone.findById(phoneId);
    if (!phone) return res.status(404).send("Phone not found");

    if (phone.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    phone.stock -= quantity;
    await phone.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error reducing stock" });
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
