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