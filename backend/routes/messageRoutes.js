const express = require('express');
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    
    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message
    });
    
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/:userId', protect, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id }
    ]
  }).sort('createdAt');
  
  res.json({ success: true, data: messages });
});

module.exports = router;