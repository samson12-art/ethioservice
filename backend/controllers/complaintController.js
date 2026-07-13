const Complaint = require('../models/Complaint');

const submitComplaint = async (req, res) => {
  try {
    const { category, subject, description } = req.body;

    if (!category || !subject || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const complaint = await Complaint.create({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      category,
      subject,
      description,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: complaint, message: 'Complaint submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const replyToComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const { status, adminReply } = req.body;
    await complaint.update({ status: status || complaint.status, adminReply: adminReply || complaint.adminReply });

    res.json({ success: true, data: complaint, message: 'Reply sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitComplaint, getMyComplaints, getAllComplaints, replyToComplaint };
