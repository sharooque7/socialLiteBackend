const express = require("express");
const Conversation = require("../models/Conversation");
const router = express.Router();
const Auth = require("../middlewares/isAuth");

const conversationController = require("../controller/conversation");

router.post("/", Auth, conversationController.createConversation);

router.get("/:userId", Auth, conversationController.getConversation);

router.get(
  "/find/:firstUserId/:secondUserId",
  Auth,
  conversationController.getConnvo
);
module.exports = router;
