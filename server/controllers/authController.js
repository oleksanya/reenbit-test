// server/controllers/authController.js
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Chat = require('../models/Chat');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const BOT_IDS = [
  '6820aba6f137502f3dbaf95d',
  '6820ae82f137502f3dbaf95e',
  '6820aea9f137502f3dbaf95f'
];

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await createNewUser(payload);
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        fullName: `${user.firstName} ${user.secondName}`,
      },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.json({
      jwtToken,
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(400).json({ message: error.message });
  }
};

async function createNewUser(payload) {
  const user = await User.create({
    firstName: payload.given_name || '',
    secondName: payload.family_name || '',
    email: payload.email,
    profileImg: payload.picture || 'default-profile.png'
  });

  const chats = await Promise.all(
    BOT_IDS.map(botId => 
      Chat.create({
        senderId: user._id,
        receiverId: botId,
        messages: [],
        lastMessage: null
      })
    )
  );

  user.chats = chats.map(chat => chat._id);
  return user.save();
}

function formatUserResponse(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    secondName: user.secondName,
    email: user.email,
    profileImg: user.profileImg
  };
}