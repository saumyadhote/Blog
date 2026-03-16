const mongoose = require('mongoose');

const weeklyPostSchema = new mongoose.Schema({
  week_number: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs/paths
  links: [{
    title: { type: String },
    url: { type: String }
  }],
  published: { type: Boolean, default: false },
  published_date: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('WeeklyPost', weeklyPostSchema);
