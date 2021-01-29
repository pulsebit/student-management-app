const bcrypt = require('bcryptjs');

function passwordHash(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function passwordCompare(plainPassword, hashPassword) {
  return bcrypt.compareSync(plainPassword, hashPassword);
}
module.exports = {
  passwordHash,
  passwordCompare
};
