const User = require('../models/User')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const upload = require("../services/upload")
const { uploadProfilePhoto } = require("../controller/appController")
const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv')

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_HOST,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })


// Upload profile picture
router.post('/profilephoto', upload.single('profilePicture'), uploadProfilePhoto)

// Update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
          try {
              const salt = await bcrypt.genSalt(10)
              req.body.password = await bcrypt.hash(req.body.password, salt)
          } catch(err) {
              return res.status(500).json(err)
          }
      }
      try {
          const user = await User.findByIdAndUpdate(req.body.userId, {
              $set: req.body,
          })
          res.status(200).json("Account successfully updated")
      } catch(err) {
          return res.status(200).json(err)
      }
    } else {
        return res.status(403).json('Action not authorised')
    }
})

// Delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
});

// Get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Search users
router.get("/search", async (req, res) => {
  try {
     const query = req.query.q
     const results = await User.find({username : new RegExp('^'+query+'.*', "i")})
     res.status(200).json(results)    
  } catch (err) {
    res.status(400).json(err)
  }
})

// Follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          // Add current user to followed user's followers[]
          await user.updateOne({ $push: { followers: req.body.userId } });
          // Vice versa, add followed user to current user's following[]
          await currentUser.updateOne({ $push: { following: req.params.id } });
          res.status(200).json("user followed");
        } else {
          res.status(403).json("you already follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you can't follow yourself");
    }
});

// Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { following: req.params.id } });
          res.status(200).json("user unfollowed");
        } else {
          res.status(403).json("you do not follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you can't unfollow yourself");
    }
});

// Add or remove a post Id to or from the array of all posts liked by user 

// attach userId to req, so that only the user can only like posts as themselves

router.put("/:id/save", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user.likedPosts.includes(req.body.postId)) {
      await user.updateOne({ $push: { likedPosts: req.body.postId } });
      res.status(200).json("post added to liked array");
    } else {
      await user.updateOne({ $pull: { likedPosts: req.body.postId } });
      res.status(200).json("post removed from liked array");
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router