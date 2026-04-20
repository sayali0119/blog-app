const router = require('express').Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user.id });
    await post.populate('author', 'username');
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update post (own only)
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('author', 'username');
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete post (own only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Toggle like
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const idx = post.likes.indexOf(req.user.id);
    if (idx === -1) post.likes.push(req.user.id);
    else post.likes.splice(idx, 1);
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
