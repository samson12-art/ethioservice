const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: message
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get conversations for a user
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort('-createdAt');

    const conversationUsers = new Map();

    for (const msg of messages) {
      const otherUserId = msg.sender.toString() === userId.toString() ? msg.receiver : msg.sender;
      
      if (!conversationUsers.has(otherUserId.toString())) {
        const otherUser = await User.findById(otherUserId).select('name avatar role email phone');
        const unreadCount = await Message.countDocuments({
          sender: otherUserId,
          receiver: userId,
          read: false
        });
        
        conversationUsers.set(otherUserId.toString(), {
          user: otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: unreadCount
        });
      }
    }

    const conversations = Array.from(conversationUsers.values());
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get messages between two users
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort('createdAt').populate('sender', 'name avatar');

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { senderId } = req.body;
    await Message.updateMany(
      { sender: senderId, receiver: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });
    res.json({ success: true, count });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage, getConversations, getMessages, markAsRead, getUnreadCount };