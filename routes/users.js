const User = require('../models/User')
const router = require('express').Router()
const bcrypt = require('bcrypt')

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
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      // Destructured to exclude unneccessary properties (password, updatedAt)
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
});

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

module.exports = router