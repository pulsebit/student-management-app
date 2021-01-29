const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  type: String,
  text: String,
  dueDate: String,
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Notification', schema);
