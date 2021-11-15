const express = require("express");

const router = express.Router();

const postController = require("../controller/post");

const Auth = require("../middlewares/isAuth");

//create a post

router.get("/all", Auth, postController.createPostsss);

//update a post
router.put("/:id", Auth, postController.updatePost);
//delete a post

router.delete("/:id", Auth, postController.deletePost);
//like or disllike a post

router.put("/:id/like", Auth, postController.likePost);
//get apost

router.get("/:id", Auth, postController.getPost);
//get timeline post
router.get("/timeline/:userId", Auth, postController.getTimeline);

//get users all post
router.get("/profile/:username", Auth, postController.getAllPost);

// router.get("/all", Auth, (req, res) => {
//   res.json("Hello");
// });

router.post("/", Auth, postController.createPost);

module.exports = router;
