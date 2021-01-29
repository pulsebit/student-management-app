const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  suburb: String,
  country: String,
  zipcode: String,
})

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  photoUrl: String,
  birthdate: Date,
  address: addressSchema,
  role: {type: String, required: true},
  email: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

userSchema.methods.isPasswordMatch = (password, callback) => {
  bcrypt.compare(password, this.password, (err, same) => {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
}

module.exports = mongoose.model('User', userSchema);
