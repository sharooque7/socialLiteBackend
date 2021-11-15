const bcrypt = require("bcrypt");
const User = require("../models/user");
const Post = require("../models/Post");

const createPost = async (req, res, next) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    console.log(error);
    error.status = 500;
    res.status(500).json({ Message: "User not found", error: error });
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (error) {
    console.log(error);
    error.status = 500;
    res.status(500).json({ Message: "User not found", error: error });
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post has been deleted");
    } else {
      res.status(403).json("You can deleted only your post");
    }
  } catch (error) {
    console.log(error);
    error.status = 500;
    res.status(500).json({ Message: "User not found", error: error });
  }
};

const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (error) {
    console.log(error);
    error.status = 500;
    res.status(500).json({ Message: "User not found", error: error });
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    error.status = 500;
    res.status(500).json({ Message: "User not found", error: error });
  }
};

const getTimeline = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllPost = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    error.status = 500;
    res.status(500).json({ Message: "User not found", error: error });
  }
};

const createPostsss = async (req, res, next) => {
  const post = await Post.find();
  res.status(200).json(post);
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
  getTimeline,
  getAllPost,
  createPostsss,
};
