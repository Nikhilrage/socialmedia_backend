const Post = require("../models/post.models");

//@desc creating feeds
//@access private
const createPost = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) res.status(400).json({ message: "Validation missing" });
    const updatedPost = await Post.create(req.body);
    if (updatedPost) {
      res.status(200).json({ message: "Post saved" });
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = { createPost };
