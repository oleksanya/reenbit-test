const mongoose = require('mongoose');

const User = require('../models/User');
const Chat = require('../models/Chat');

const predefinedBotIds = [
  new mongoose.Types.ObjectId('6820aba6f137502f3dbaf95d'),
  new mongoose.Types.ObjectId('6820ae82f137502f3dbaf95e'),
  new mongoose.Types.ObjectId('6820aea9f137502f3dbaf95f'),
];

exports.createUser = async (req, res) => {
  try {
    const { firstName, secondName, profileImg, email } = req.body;

    if (!firstName || !secondName) {
      return res.status(400).json({ message: 'First and second names are required' });
    }

    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({ firstName, secondName, profileImg, email });
    await newUser.save();

    const systemUsers = await User.find({ _id: { $in: predefinedBotIds } });

    if (systemUsers.length < 3) {
      return res.status(500).json({ message: 'Not enough predefined users to create chats' });
    }

    const predefinedChats = systemUsers.map(async (sysUser) => {
      const chat = new Chat({
        senderId: newUser._id,
        receiverId: sysUser._id,
        messages: [],
        lastMessage: null,
      });
      await chat.save();

      return chat._id;
    });

    const chatIds = await Promise.all(predefinedChats);
    newUser.chats = chatIds;

    await newUser.save();
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('createUser error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ message: 'Unauthorized: no email in token' });
    }

    const user = await User.findOne({ email: userEmail }).populate('chats');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('getUser error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changeProfileImg = async (req, res) => {
  try {
    const userId = req.params.id;
    const { profileImg } = req.body;

    if (!profileImg) {
      return res.status(400).json({ message: 'Profile image is required' });
    }

    const user = await User.findByIdAndUpdate(userId, { profileImg }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('changeProfileImg error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
