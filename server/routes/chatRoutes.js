const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/:id', chatController.getChatData);
router.get('/getAllChats/:id', chatController.getAllChatsByUserId);
router.post('/create', chatController.createChat);
router.post('/create-with-names', chatController.createChatWithNames);
router.put('/update/:chatId', chatController.updateChatUser);
router.delete('/delete/:id', chatController.deleteChat);
module.exports = router;
