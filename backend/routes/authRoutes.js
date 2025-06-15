import express from 'express';
import { register, login } from '../controllers/authController.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});
router.post('/households', passport.authenticate('jwt', { session: false }), (req, res) => {
  // ...
});
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);
export default router;