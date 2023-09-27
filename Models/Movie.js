const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl:{
    type:String
  },
  genre:{
    type:String
  },
  duration:{
    type:String
  },
date:{
  type:Date,
  default:Date.now
}
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;