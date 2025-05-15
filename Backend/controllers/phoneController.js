const Phone = require('../models/Phone');

// Controller to get all phones from the 'phonelisting' collection
module.exports.getPhones = async (req, res) => {
  try {
    const phones = await Phone.find();  // Find all phones
    res.json(phones); // Send the list of phones as JSON response
    console.log("Server Success =",phones);
  } catch (error) {
    console.log("Server Error",error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports.getPhoneSeller = async (req, res) => {
  try {
    const phones = await Phone.find()
    .populate('seller', 'firstname lastname email')
    .populate('reviews.reviewer', 'firstname lastname');
    res.status(200).json(phones);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};


module.exports.getPhoneById = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id)
    .populate('reviews.reviewer', 'firstname lastname')
    .populate('seller', 'firstname lastname email');

    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }

    res.status(200).json(phone);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
  }

  try {
    const phone = await Phone.findById(req.params.phoneId);
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }

    // (Optional) Check if user already reviewed
    const alreadyReviewed = phone.reviews.find(
      (rev) => rev.reviewer.toString() === userId.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already submitted a review for this phone.' });
    }

    const newReview = {
      reviewer: userId, 
      rating: Number(rating),
      comment,
    };

    phone.reviews.push(newReview);

    // Update average rating
    phone.rating =
      phone.reviews.reduce((acc, r) => acc + r.rating, 0) / phone.reviews.length;

    await phone.save();

    // Re-fetch with populated reviewer info
    const updatedPhone = await Phone.findById(req.params.phoneId).populate(
      'reviews.reviewer',
      'firstname lastname'
    );

    res.status(201).json({
      message: 'Review added successfully',
      reviews: updatedPhone.reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding review',
      error: error.message,
    });
  }
};

module.exports.reviewerInfo = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.phoneId)
    .populate('reviews.reviewer', 'firstname lastname');
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    res.json(phone.reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};