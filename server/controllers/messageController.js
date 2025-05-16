const axios = require('axios');

const Message = require('../models/Message');
const Chat = require('../models/Chat');

exports.createMessage = async (req, res) => {
  try {
    const { userId, chatId, content } = req.body;
    const currentUserId = userId;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = new Message({
      userId: userId,
      chatId: chatId,
      content: content,
    });

    await newMessage.save();

    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: newMessage._id },
      lastMessage: newMessage._id,
    });    const populatedMessage = await Message.findById(newMessage._id)
      .populate('userId', 'firstName secondName profileImg');

    //bot id
    const responseUserId = await Chat.findById(chatId).then((chat) => {
      return chat.senderId.toString() === currentUserId.toString()
        ? chat.receiverId
        : chat.senderId;
    });
    
    // Get io instance from the app
    const io = req.app.get('io');
    
    // Broadcast message to all clients
    io.emit('newMessage', populatedMessage);
    
    // Also update chat list with latest message
    io.emit('chatUpdated', {
      chatId,
      lastMessage: populatedMessage
    });
    
    res.status(201).json({ message: populatedMessage });

    // Bot responds after 3 seconds
    setTimeout(async () => {
      try {
        const quoteRes = await axios.get('https://zenquotes.io/api/quotes/random');

        const botMessage = new Message({
          userId: responseUserId,
          chatId: chatId,
          content: quoteRes.data[0].q,
        });
        await botMessage.save();

        await Chat.findByIdAndUpdate(chatId, {
          $push: { messages: botMessage._id },
          lastMessage: botMessage._id,
        });        const populatedBotMessage = await Message.findById(botMessage._id)
          .populate('userId', 'firstName secondName profileImg');
        
        // Get io instance from the app
        const io = req.app.get('io');
        
        // Emit bot message to all clients
        io.emit('newMessage', populatedBotMessage);
        
        // Also broadcast the last message update for chat list
        io.emit('chatUpdated', {
          chatId,
          lastMessage: populatedBotMessage
        });
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    }, 3000);

  } catch (error) {
    console.error('createMessage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const messageId = req.params.id;
    const message = await Message.findById(messageId).populate('userId chatId');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message });
  } catch (error) {
    console.error('getMessageById error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.editMessage = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);

    const messageId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { content: content },
      { new: true }
    ).populate({
      path: 'userId chatId',
      select: '-messages',
    });

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: updatedMessage });
  } catch (error) {
    console.error('editMessage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    await Chat.findByIdAndUpdate(deletedMessage.chatId, {
      $pull: { messages: messageId },
    });

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('deleteMessage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllMessagesFromChat = async (req, res) => {
  try {
    const chatId = req.params.id;
    const messages = await Message.find({ chatId: chatId }).populate({
      path: 'chatId',
      select: '-messages',
      populate: {
        path: 'receiverId',
        model: 'User',
      },
    });

    if (!messages) {
      return res.status(404).json({ message: 'Messages not found' });
    }
    res.status(200).json({ messages });
  } catch (error) {
    console.error('getAllMessagesFromChat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLastMessage = async (req, res) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId).populate('lastMessage');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json({ lastMessage: chat.lastMessage });
  } catch (error) {
    console.error('getLastMessage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
