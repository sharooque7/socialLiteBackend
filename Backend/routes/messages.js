const express = require("express");
const Message = require("../models/Message");
const Auth = require("../middlewares/isAuth");

const router = express.Router();

const MessageController = require("../controller/messages");

router.post("/", Auth, MessageController.addMessage);

router.get("/:conversationId", Auth, MessageController.getAllMessages);

module.exports = router;
