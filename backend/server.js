import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';
import expenseRoutes from './routes/expenseRoutes.js';
import householdRoutes from './routes/householdRoutes.js';
// ... other imports

connectDB();
app.use('/api/auth', authRoutes);
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/expenses', expenseRoutes);
app.use('/api/households', householdRoutes);