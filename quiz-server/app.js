const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 8000;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./passport');
const db = require('./app/models');
const { FE_BASE_URL } = require('./config/api');

const corsOptions = {
  origin: FE_BASE_URL,      
  methods: 'GET,POST,PUT,DELETE,OPTIONS', 
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  credentials: true 
};

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: db.url,
      collectionName: 'sessions',
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Gunakan HTTPS jika di production
      httpOnly: true, // false kalo menggunakan https
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isAuthenticated = (req, res) => {
  if (req.isAuthenticated() || req.session.user_id) {
    return res.json({ authenticated: true, user: req.user || req.session.user_id });
  }
  res.json({ authenticated: false });
};

db.mongoose
    .connect(db.url)
    .then((result) => {
        console.log('Database connected!')
    }).catch((err) => {
        console.log("Cannot connect to database!", err)
        process.exit()
    })


app.get('/', (req, res) => {
  res.json({
      message: "Welcome to quiz-server"
  })
})

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(FE_BASE_URL);
  }
);

app.get('/auth/status', isAuthenticated);

app.get('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).send('Logout failed');
    }

    delete req.session.user_id;

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Failed to destroy session:', destroyErr);
        return res.status(500).send('Failed to destroy session');
      }

      res.clearCookie('connect.sid'); 

      res.redirect('/');
    });
  });
});

app.get('/get-user', (req, res) => {
  if (req.session.user_id || req.user) {
    res.status(200).send({ user_id: req.session.user_id || req.user._id });
  } else {
    res.status(401).send({ message: 'User not logged in' });
  }
});



require('./app/routes/user.route')(app);
require('./app/routes/record.route')(app);


app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`)
})