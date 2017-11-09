const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  title: String,
  contents: String,
  author : String,
  image : String,
});

module.exports = mongoose.model('board', boardSchema);
