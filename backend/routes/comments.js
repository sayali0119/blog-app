const router = require('express').Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username').sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:postId', auth, async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user.id,
      content: req.body.content,
    });
    await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Not found' });
    if (comment.author.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
