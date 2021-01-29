const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {type: String, required: true},
  tabField: Array,
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Tab', schema);
