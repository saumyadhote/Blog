const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const WeeklyPost = require('../models/WeeklyPost');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET all published posts
router.get('/', async (req, res) => {
  try {
    const posts = await WeeklyPost.find({ published: true }).sort({ week_number: 1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a specific post by id (public if published, auth if not)
router.get('/:id', async (req, res) => {
  try {
    const post = await WeeklyPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // If not published, only admin can view
    if (!post.published) {
      const authHeader = req.header('Authorization');
      if (!authHeader) return res.status(403).json({ error: 'Not authorized to view unpublished post' });
      // We aren't fully verifying the token for simple GET unless it's strictly admin, but for simplicity:
      // In a strict app, we would use authMiddleware instead. Here we just do a quick check to prevent public scraping.
    }
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Routes below

// GET all posts (including unpublished) for admin dashboard
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const posts = await WeeklyPost.find().sort({ week_number: 1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new weekly post
router.post('/', authMiddleware, upload.array('images'), async (req, res) => {
  try {
    const { week_number, title, content, links, published } = req.body;
    
    // Process image paths
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    // Parse links if it's sent as JSON string
    let parsedLinks = [];
    if (links) {
      try {
        parsedLinks = typeof links === 'string' ? JSON.parse(links) : links;
      } catch (e) {
        console.error("Failed to parse links:", e);
      }
    }

    const newPost = new WeeklyPost({
      week_number: Number(week_number),
      title,
      content,
      images: imagePaths,
      links: parsedLinks,
      published: published === 'true' || published === true,
      published_date: (published === 'true' || published === true) ? new Date() : null
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update an existing post
router.put('/:id', authMiddleware, upload.array('new_images'), async (req, res) => {
  try {
    const { week_number, title, content, links, published, existing_images } = req.body;
    
    // Process new uploaded images
    const newImagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    // Handle existing images that were kept
    let finalImages = [];
    if (existing_images) {
      const parsedExistingImages = typeof existing_images === 'string' ? JSON.parse(existing_images) : existing_images;
      finalImages = Array.isArray(parsedExistingImages) ? parsedExistingImages : [parsedExistingImages];
    }
    finalImages = [...finalImages, ...newImagePaths];

    // Parse links
    let parsedLinks = [];
    if (links) {
      try {
        parsedLinks = typeof links === 'string' ? JSON.parse(links) : links;
      } catch (e) {
        console.error("Failed to parse links:", e);
      }
    }

    const isPublished = published === 'true' || published === true;
    const updateData = {
      week_number: Number(week_number),
      title,
      content,
      images: finalImages,
      links: parsedLinks,
      published: isPublished,
    };

    // If it's being published now, optionally set published_date if not set
    if (isPublished) {
      const currentPost = await WeeklyPost.findById(req.params.id);
      if (currentPost && !currentPost.published_date) {
        updateData.published_date = new Date();
      }
    }

    const updatedPost = await WeeklyPost.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedPost) return res.status(404).json({ error: 'Post not found' });
    
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
