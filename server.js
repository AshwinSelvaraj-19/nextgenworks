const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────────────────────
// Database Setup
// ─────────────────────────────────────────────────────────────
const db = new Database('nextgenwork.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT
  );
`);

// ─────────────────────────────────────────────────────────────
// Seed Initial Services
// ─────────────────────────────────────────────────────────────
const serviceCount = db.prepare(
  'SELECT COUNT(*) as count FROM services'
).get();

if (serviceCount.count === 0) {
  const insertService = db.prepare(`
    INSERT INTO services (category, name, price, description)
    VALUES (?, ?, ?, ?)
  `);

  const services = [
    ['Video Editing', 'Short Reel (under 60 sec)', '₹500', 'Quick promo reel'],
    ['Video Editing', 'YouTube Video (5–10 min)', '₹1,500', 'Professional editing'],
    ['Web Design', 'Landing Page', '₹3,000', 'Single page website'],
    ['Web Design', 'Business Website', '₹10,000+', 'Multi-page website'],
    ['Social Media', '10 Posts / Month', '₹3,000', 'Social media management']
  ];

  services.forEach(service => {
    insertService.run(...service);
  });

  console.log('✅ Services seeded');
}

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server running successfully'
  });
});

// Get Services
app.get('/api/services', (req, res) => {
  try {
    const services = db.prepare(
      'SELECT * FROM services ORDER BY category, id'
    ).all();

    const grouped = services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }

      acc[service.category].push(service);
      return acc;
    }, {});

    res.json({
      success: true,
      data: grouped
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Submit Enquiry
app.post('/api/enquiry', (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    // Validation
    if (!name || !phone || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    if (phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number'
      });
    }

    const insert = db.prepare(`
      INSERT INTO enquiries
      (name, phone, email, service, message)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      name,
      phone,
      email || '',
      service,
      message
    );

    res.json({
      success: true,
      message: 'Enquiry submitted successfully',
      id: result.lastInsertRowid
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Admin - Get Enquiries
app.get('/api/admin/enquiries', (req, res) => {
  try {
    const enquiries = db.prepare(`
      SELECT * FROM enquiries
      ORDER BY created_at DESC
    `).all();

    res.json({
      success: true,
      data: enquiries
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries'
    });
  }
});

// Update Enquiry Status
app.patch('/api/admin/enquiries/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    db.prepare(`
      UPDATE enquiries
      SET status = ?
      WHERE id = ?
    `).run(status, id);

    res.json({
      success: true,
      message: 'Status updated'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Update failed'
    });
  }
});

// Delete Enquiry
app.delete('/api/admin/enquiries/:id', (req, res) => {
  try {
    const { id } = req.params;

    db.prepare(`
      DELETE FROM enquiries
      WHERE id = ?
    `).run(id);

    res.json({
      success: true,
      message: 'Deleted successfully'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Delete failed'
    });
  }
});

// ─────────────────────────────────────────────────────────────
// Frontend Routing
// ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'public', 'index.html')
  );
});

// ─────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
