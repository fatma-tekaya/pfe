// conversation.js

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/conversation.js'); // Make sure the path to your controller file is correct
const { isAuth } = require("../middelwares/auth");


router.post('/handleMessage/:conversationId?', isAuth, chatController.handleMessage); // Check if chatController.startConversation is correctly exported from the controller file
router.delete('/deleteConversation/:conversationId',isAuth , chatController.deleteConversation);
router.get('/getConversations', isAuth ,chatController.getConversations);
router.get('/getConversation/:conversationId', isAuth ,chatController.getConversation);
module.exports = router;
