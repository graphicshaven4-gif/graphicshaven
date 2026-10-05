require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { protect } = require('./middleware/authMiddleware');

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(
  cors({
    origin: true, // Dynamically reflects origin so external frontend hosts (Vercel, Netlify, custom domain) can connect
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Root status endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Graphics Haven Backend API is live & running',
    version: '1.0.0',
    health: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Graphics Haven Auth & Admin Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes (Login and Register API code)
app.use('/api/auth', authRoutes);

// Content Management Routes (Services, Portfolio, Clients, Testimonials, Blogs)
app.use('/api/content', contentRoutes);

// Client Contact Inquiries Route (Form submission & Email dispatch)
app.use('/api/inquiries', inquiryRoutes);

// Image Upload Route (Cloudinary with local storage fallback)
app.use('/api/upload', uploadRoutes);

// Protected Admin Dashboard Route
app.get('/api/admin/dashboard-stats', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      activeProjects: 14,
      totalInquiries: 38,
      happyClients: 1042,
      pendingReviews: 3,
      recentInquiries: [
        {
          id: 'inq-101',
          name: 'Sarah Jenkins',
          email: 'sarah@nordicliving.com',
          service: 'Brand Identity',
          budget: '$5k – $15k',
          date: 'Just now',
          status: 'New',
        },
        {
          id: 'inq-102',
          name: 'Vikram Sundaram',
          email: 'vikram@chennaitech.io',
          service: 'Website Design',
          budget: '$15k – $50k',
          date: '2 hours ago',
          status: 'In Review',
        },
        {
          id: 'inq-103',
          name: 'Elena Rostova',
          email: 'elena@luxpackaging.fr',
          service: 'Product Packaging Design',
          budget: '$5k – $15k',
          date: 'Yesterday',
          status: 'Contacted',
        },
      ],
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Graphics Haven Backend Server running`);
    console.log(`Status:  Running on http://localhost:${PORT}`);
  });
}

module.exports = app;
