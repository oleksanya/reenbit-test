const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/:id', chatController.getChatData);
router.get('/getAllChats/:id', chatController.getAllChatsByUserId);
router.post('/create', chatController.createChat);
router.delete('/delete/:id', chatController.deleteChat);
module.exports = router;
