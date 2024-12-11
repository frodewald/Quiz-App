const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./app/models');
const User = db.users;
const crypto = require('crypto');

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '${BASE_URL}/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          let isUsernameNotUnique = await User.findOne({ name: profile.displayName });
          
          if (isUsernameNotUnique) {
            let uniqueName = profile.displayName;
            let randomSuffix = crypto.randomBytes(4).toString('hex');
            uniqueName = `${uniqueName}_${randomSuffix}`;
    
            while (await User.findOne({ name: uniqueName })) {
              randomSuffix = crypto.randomBytes(4).toString('hex');
              uniqueName = `${profile.displayName}_${randomSuffix}`; 
            }
    
            user = new User({
              googleId: profile.id,
              name: uniqueName,
              email: profile.emails[0].value,
              picture: profile.photos[0].value,
            });
          } else {
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              picture: profile.photos[0].value,
            });
          }
    
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
