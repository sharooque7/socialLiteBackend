const User = require("../models/user");
const bcrypt = require("bcrypt");

const update = async (req, res, next) => {
  const id = req.params.id;

  if (req.body.userId === id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        console.log(error);
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
};
const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  if (req.body.userId === id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
};

const getUser = async (req, res, next) => {
  const userId = req.query.userId;
  console.log(userId);
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    !user && res.status(404).json("User not found");
    res.status(200).json(other);
  } catch (error) {
    console.log(error);
    error.status = 500;
    res.status(500).json({ Message: "Not found", error: error });
  }
};

const follow = async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      //user that going to be followed
      const user = await User.findById(req.params.id);
      //current user is the on req to follow that user
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (error) {
      console.log(error);
      error.status = 500;
      res.status(500).json({ Message: "User not found", error: error });
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
};

const unFollow = async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
};
const getFollowerdetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    console.log(error);
    error.status = 500;
    res.status(500).json({ Message: "User not found", error: error });
  }
};

module.exports = {
  update,
  deleteUser,
  getUser,
  follow,
  unFollow,
  getFollowerdetail,
};
