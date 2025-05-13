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

// module.exports = { getPhones };
