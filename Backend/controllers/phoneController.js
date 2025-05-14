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
    const phones = await Phone.find().populate('seller', 'firstname lastname email');
    res.status(200).json(phones);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};


module.exports.getPhoneById = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id).populate('seller', 'firstname lastname email');

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
  const userId = req.user?._id; // assumes user is authenticated and middleware sets req.user

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
  }

  try {
    const phone = await Phone.findById(req.params.phoneId);
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }

    const user = await User.findById(userId).select('firstname lastname');

    const newReview = {
      name: `${user.firstname} ${user.lastname}`,
      rating: Number(rating),
      comment,
      user: userId
    };

    phone.reviews.push(newReview);
    phone.rating = phone.reviews.reduce((acc, r) => acc + r.rating, 0) / phone.reviews.length;

    await phone.save();
    res.status(201).json({ message: 'Review added successfully', reviews: phone.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

module.exports.reviewerInfo = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.phoneId).populate('reviews.user', 'firstname lastname');
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    res.json(phone.reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};