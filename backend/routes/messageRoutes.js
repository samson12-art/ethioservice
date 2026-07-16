const express = require('express');
const { sendMessage, getConversations, getMessages, markAsRead, getUnreadCount } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { messageValidation } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/send', messageValidation, sendMessage);
router.get('/conversations', getConversations);
router.get('/unread/count', getUnreadCount);
router.put('/read', markAsRead);
router.get('/:userId', getMessages);

module.exports = router;
