const express = require('express');
const { sendMessage, getConversations, getMessages, markAsRead, getUnreadCount } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/send', sendMessage);
router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.put('/read', markAsRead);
router.get('/unread/count', getUnreadCount);

module.exports = router;
