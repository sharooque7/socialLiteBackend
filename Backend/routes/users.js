const express = require("express");

const router = express.Router();

const userController = require("../controller/user");

const Auth = require("../middlewares/isAuth");

//update user
router.put("/:id", Auth, userController.update);
//Delete User
router.delete("/:id", Auth, userController.deleteUser);

//get friend
router.get("/friends/:userId", Auth, userController.getFollowerdetail);

//follow a user
router.put("/:id/follow", Auth, userController.follow);

//unfollow a user
router.put("/:id/unfollow", Auth, userController.unFollow);

//get a user
router.get("/", Auth, userController.getUser);

module.exports = router;
