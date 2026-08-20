const Complaint = require('../models/Complaint');
const User = require('../models/User');

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

const assignComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const { providerId } = req.body;
    if (!providerId) {
      return res.status(400).json({ success: false, message: 'Provider ID is required' });
    }

    const provider = await User.findByPk(providerId);
    if (!provider || provider.role !== 'provider') {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    await complaint.update({
      assignedProviderId: provider.id,
      assignedProviderName: provider.name,
      assignedAt: new Date(),
      status: complaint.status === 'pending' ? 'forwarded' : complaint.status
    });

    res.json({ success: true, data: complaint, message: `Complaint assigned to ${provider.name}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProviderComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      where: { assignedProviderId: req.user.id },
      order: [['assignedAt', 'DESC']]
    });
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProviderNotes = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.assignedProviderId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'This complaint is not assigned to you' });
    }

    const { providerNotes, status } = req.body;
    const updateData = {};
    if (providerNotes !== undefined) updateData.providerNotes = providerNotes;
    if (status) updateData.status = status;

    await complaint.update(updateData);

    res.json({ success: true, data: complaint, message: 'Follow-up updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProviders = async (req, res) => {
  try {
    const providers = await User.findAll({
      where: { role: 'provider', isVerified: true },
      attributes: ['id', 'name', 'email', 'profession', 'city']
    });
    res.json({ success: true, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  replyToComplaint,
  assignComplaint,
  getProviderComplaints,
  updateProviderNotes,
  getAllProviders
};
