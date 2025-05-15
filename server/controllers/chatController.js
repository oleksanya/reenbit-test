const mongoose = require('mongoose');

const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');

exports.getChatData = async (req, res) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId).populate('senderId', 'firstName secondName profileImg')
      .populate('receiverId', 'firstName secondName profileImg')
      .populate({
        path: 'lastMessage',
        populate: {
        path: 'userId',
        select: 'firstName secondName profileImg'
        }
      }).populate({
        path: 'messages',
        populate: {
          path: 'userId',
          select: '_id'
        },
        options: { sort: { createdAt: 1 } }
      });;

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json({ chat });
  } catch (error) {
    console.error('getChat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: 'Sender and receiver IDs are required' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Sender and receiver IDs cannot be the same' });
    }

    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({
        message: 'Invalid ID format. IDs must be 24 character hex strings',
        invalidId: !mongoose.Types.ObjectId.isValid(senderId) ? senderId : receiverId,
      });
    }

    const existingChat = await Chat.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (existingChat) {
      return res.status(400).json({ message: 'Chat already exists' });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or receiver not found' });
    }

    const chat = new Chat({ senderId, receiverId });
    await chat.save();

    sender.chats.push(chat._id);
    receiver.chats.push(chat._id);

    await sender.save();
    await receiver.save();

    res.status(201).json({ chat });
  } catch (error) {
    console.error('createChat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createChatWithNames = async (req, res) => {
  try {
    const { firstName, secondName, currentUserId } = req.body;

    if (!firstName || !secondName || !currentUserId) {
      return res.status(400).json({ message: 'First name, second name and current user ID are required' });
    }

    const newUser = new User({
      firstName,
      secondName,
      profileImg: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    });
    await newUser.save();

    const existingChat = await Chat.findOne({
      $or: [
        { senderId: currentUserId, receiverId: newUser._id },
        { senderId: newUser._id, receiverId: currentUserId },
      ],
    });

    if (existingChat) {
      return res.status(400).json({ message: 'Chat already exists with this user' });
    }

    const chat = new Chat({
      senderId: currentUserId,
      receiverId: newUser._id
    });
    await chat.save();

    // Update both users' chats arrays
    const currentUser = await User.findById(currentUserId);
    const receiver = newUser;

    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    currentUser.chats.push(chat._id);
    receiver.chats.push(chat._id);

    await currentUser.save();
    await receiver.save();

    // Populate chat data for response
    const populatedChat = await Chat.findById(chat._id)
      .populate('senderId', 'firstName secondName profileImg')
      .populate('receiverId', 'firstName secondName profileImg');

    res.status(201).json({ chat: populatedChat, user: receiver });
  } catch (error) {
    console.error('createChatWithNames error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllChatsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId)   .populate({
        path: 'chats',
        populate: [
          {
            path: 'senderId',
            select: 'firstName secondName profileImg'
          },
          {
            path: 'receiverId',
            select: 'firstName secondName profileImg'
          },
          {
            path: 'lastMessage',
            populate: {
              path: 'userId',
              select: 'firstName secondName profileImg'
            }
          },
          {
            path: 'messages',
            select: 'content senderId createdAt',
            options: { sort: { createdAt: 1 } }
          }
        ]
      })
      .select('chats');;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('getAllChatByUserId error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const sender = await User.findById(chat.senderId);
    const receiver = await User.findById(chat.receiverId);

    if (sender) {
      sender.chats = sender.chats.filter((chat) => chat.toString() !== chatId);
      await sender.save();
    }
    if (receiver) {
      receiver.chats = receiver.chats.filter((chat) => chat.toString() !== chatId);
      await receiver.save();
    }

    await Message.deleteMany({ chatId: chat._id });
    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('deleteChat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateChatUser = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { firstName, secondName } = req.body;

    if (!chatId || !firstName || !secondName) {
      return res.status(400).json({ message: 'Chat ID, first name, and second name are required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Update the receiver's information
    const receiver = await User.findByIdAndUpdate(
      chat.receiverId,
      { firstName, secondName },
      { new: true }
    );

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Get updated chat with populated data
    const updatedChat = await Chat.findById(chatId)
      .populate('senderId', 'firstName secondName profileImg')
      .populate('receiverId', 'firstName secondName profileImg')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'userId',
          select: 'firstName secondName profileImg'
        }
      });

    res.status(200).json({ chat: updatedChat });
  } catch (error) {
    console.error('updateChatUser error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
