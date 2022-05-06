const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    tags: {
      type: Array,
      default: [],
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
    userImg: {
      type: String
    },
    username: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);