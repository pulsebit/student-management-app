const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {type: String, required: true},
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Tag', schema);
