const Message = require('../models/message');
const User = require('../models/User');
const { Op } = require('sequelize');

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver ID is required' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    if (receiverId.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot send message to yourself' });
    }

    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    const newMessage = await Message.create({
      senderId: req.user.id.toString(),
      receiverId: receiverId.toString(),
      message: message.trim()
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id.toString();

    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }]
      },
      order: [['createdAt', 'DESC']]
    });

    const conversationMap = new Map();

    for (const msg of messages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;

      if (!conversationMap.has(otherUserId)) {
        const otherUser = await User.findByPk(otherUserId, {
          attributes: ['id', 'name', 'email', 'role']
        });

        const unreadCount = await Message.count({
          where: { senderId: otherUserId, receiverId: userId, read: false }
        });

        conversationMap.set(otherUserId, {
          user: otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount
        });
      }
    }

    const conversations = Array.from(conversationMap.values());
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id.toString();

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    await Message.update(
      { read: true },
      { where: { senderId: userId, receiverId: currentUserId, read: false } }
    );

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { senderId } = req.body;
    if (!senderId) {
      return res.status(400).json({ success: false, message: 'Sender ID is required' });
    }
    await Message.update(
      { read: true },
      { where: { senderId, receiverId: req.user.id.toString(), read: false } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.count({
      where: { receiverId: req.user.id.toString(), read: false }
    });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage, getConversations, getMessages, markAsRead, getUnreadCount };
