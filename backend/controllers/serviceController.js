const Service = require('../models/Service');
const Doctor = require('../models/Doctor');

const getServices = async (req, res) => {
  try {
    const { category, city } = req.query;
    const where = {};

    if (category && category !== 'all') where.category = category;
    if (city && city !== 'all') where.city = city;

    const services = await Service.findAll({ where });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDoctors = async (req, res) => {
  try {
    const { specialty, city } = req.query;
    const where = {};

    if (specialty && specialty !== 'all') where.specialtyName = specialty;
    if (city && city !== 'all') where.city = city;

    const doctors = await Doctor.findAll({ where });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      providerId: req.user.id.toString(),
      providerName: req.user.name
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await service.update(req.body);
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    if (req.user.role === 'provider' && service.providerId !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await service.destroy();
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { providerId: req.user.id.toString() },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getServices, getDoctors, createService, updateService, deleteService, getMyServices };
