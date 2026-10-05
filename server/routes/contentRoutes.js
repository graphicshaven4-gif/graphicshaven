const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Blog = require('../models/Blog');
const Service = require('../models/Service');
const Client = require('../models/Client');
const Testimonial = require('../models/Testimonial');
const { seedContentIfEmpty } = require('../config/seedContent');

// GET all content in one request for fast UI hydration
router.get('/all', async (req, res) => {
  try {
    await seedContentIfEmpty();

    const [services, portfolio, clients, testimonials, blogs] = await Promise.all([
      Service.find().lean(),
      Portfolio.find().sort({ createdAt: -1 }).lean(),
      Client.find().lean(),
      Testimonial.find().lean(),
      Blog.find().sort({ createdAt: -1 }).lean(),
    ]);

    // Format _id to id
    const formatId = (list) =>
      list.map((item) => ({
        ...item,
        id: item._id.toString(),
      }));

    res.status(200).json({
      success: true,
      data: {
        services: formatId(services),
        portfolio: formatId(portfolio),
        clients: formatId(clients),
        testimonials: formatId(testimonials),
        blogs: formatId(blogs),
      },
    });
  } catch (error) {
    console.warn('[Content Fetch Notice]: MongoDB is connecting or unavailable, serving fallback cache.');
    res.status(200).json({
      success: true,
      fallback: true,
      data: {
        services: [],
        portfolio: [],
        clients: [],
        testimonials: [],
        blogs: [],
      },
    });
  }
});

// ==========================================
// PORTFOLIO CRUD (MongoDB Atlas)
// ==========================================
router.get('/portfolio', async (req, res) => {
  try {
    await seedContentIfEmpty();
    const items = await Portfolio.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      data: items.map((p) => ({ ...p, id: p._id.toString() })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/portfolio', async (req, res) => {
  try {
    const { title, category, year, description, image, featured } = req.body;
    const item = await Portfolio.create({
      title,
      category,
      year: year || '2026',
      description,
      image,
      featured: featured !== undefined ? featured : true,
    });
    res.status(201).json({
      success: true,
      data: { ...item.toObject(), id: item._id.toString() },
      message: 'Portfolio project saved to database successfully',
    });
  } catch (error) {
    console.error('[Portfolio Save Error]:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/portfolio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Portfolio.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({
      success: true,
      data: { ...updated.toObject(), id: updated._id.toString() },
      message: 'Project updated in database',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/portfolio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Portfolio.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Project deleted from database' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// BLOGS CRUD (MongoDB Atlas)
// ==========================================
router.get('/blogs', async (req, res) => {
  try {
    await seedContentIfEmpty();
    const items = await Blog.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      data: items.map((b) => ({ ...b, id: b._id.toString() })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/blogs', async (req, res) => {
  try {
    const { title, excerpt, date, readTime, category, image } = req.body;
    const item = await Blog.create({
      title,
      excerpt,
      date: date || 'Oct 2026',
      readTime: readTime || '5 min read',
      category: category || 'Brand Strategy',
      image,
    });
    res.status(201).json({
      success: true,
      data: { ...item.toObject(), id: item._id.toString() },
      message: 'Blog article saved to database successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.status(200).json({
      success: true,
      data: { ...updated.toObject(), id: updated._id.toString() },
      message: 'Article updated',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Article deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// SERVICES CRUD (MongoDB Atlas)
// ==========================================
router.get('/services', async (req, res) => {
  try {
    await seedContentIfEmpty();
    const items = await Service.find().lean();
    res.status(200).json({
      success: true,
      data: items.map((s) => ({ ...s, id: s._id.toString() })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const item = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: { ...item.toObject(), id: item._id.toString() },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Service.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      success: true,
      data: { ...updated.toObject(), id: updated._id.toString() },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// CLIENTS CRUD (MongoDB Atlas)
// ==========================================
router.get('/clients', async (req, res) => {
  try {
    await seedContentIfEmpty();
    const items = await Client.find().lean();
    res.status(200).json({
      success: true,
      data: items.map((c) => ({ ...c, id: c._id.toString() })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/clients', async (req, res) => {
  try {
    const item = await Client.create(req.body);
    res.status(201).json({
      success: true,
      data: { ...item.toObject(), id: item._id.toString() },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Client.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      success: true,
      data: { ...updated.toObject(), id: updated._id.toString() },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Client deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// TESTIMONIALS CRUD (MongoDB Atlas)
// ==========================================
router.get('/testimonials', async (req, res) => {
  try {
    await seedContentIfEmpty();
    const items = await Testimonial.find().lean();
    res.status(200).json({
      success: true,
      data: items.map((t) => ({ ...t, id: t._id.toString() })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const item = await Testimonial.create(req.body);
    res.status(201).json({
      success: true,
      data: { ...item.toObject(), id: item._id.toString() },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      success: true,
      data: { ...updated.toObject(), id: updated._id.toString() },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
