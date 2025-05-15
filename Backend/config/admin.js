const bcrypt = require('bcrypt');

const adminEmail = 'admin@example.com';
const plainPassword = 'Admin@123';
const hashedPassword = bcrypt.hashSync(plainPassword, 10);

module.exports = {
  adminEmail,
  hashedPassword
};
