const Post = require("../models/Post");
const User = require("../models/User")

const uploadPost = async (req, res) => {
  try {
    if (req.file && req.file.path) {
      const newPost = new Post({
        userId: req.body.userId,
        img: req.file.path,
        tags: req.body.tags? JSON.parse(req.body.tags): [],
        desc: req.body.caption
      })
      await newPost.save();
      return res.status(200).json({ msg: "post successfully uploaded" });
    } else {
      console.log(req.file);
      return res.status(422).json({ error: "invalid" });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "some error occured" });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    if (req.file && req.file.path) {
      const user = await User.findByIdAndUpdate(req.body.userId, {
        $set: {profilePicture: req.file.path},
      })
      res.status(200).json(req.file.path)   
    } else {
      console.log(req.file);
      return res.status(422).json({ error: "invalid" });
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "some error occured" });
  }

}
module.exports = { uploadPost, uploadProfilePhoto }