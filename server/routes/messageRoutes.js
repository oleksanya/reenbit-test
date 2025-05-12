const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/send', messageController.createMessage);
router.get('/getMessage/:id', messageController.getMessageById);
router.get('/getAllMessages/:id', messageController.getAllMessagesFromChat);
router.get('/last/:id', messageController.getLastMessage);
router.patch('/edit/:id', messageController.editMessage);
router.delete('/delete/:id', messageController.deleteMessage);

module.exports = router;
