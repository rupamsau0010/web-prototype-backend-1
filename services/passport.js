// Getting the depandencies

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

// Getting the local depandencies

const User = require("../models/Users");

// Setting up the passport module

module.exports = function (passport, req, res) {
  // Use of SerializerUser and DeserializerUser...
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
  
  //-----------------------------------------------------------------------//
  // For Google Authentication

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        // console.log(profile);
        // Creating the new user docs in json format...

        const newUser = {
          registrationId: profile.id,
          displayName: profile.displayName,
          userName: profile.displayName.split(" ")[0] + "_" + profile.id,
          image: profile.photos[0].value,
          profileType: "general"
        };

        // console.log(newUser);

        try {
          // Seeing the user already there in the DB or not...
          let user = await User.findOne({ registrationId: profile.id });

          if (user) {
            // If user is already in the Database...
            done(null, user);
          } else {
            // If user is not in the Database (new user)...
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  //-----------------------------------------------------------------------//
  //-----------------------------------------------------------------------//
  // For Facebook Authentication

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        // Creating the new user docs in json format... 
        //console.log(profile); 

        const newUser = {
          registrationId: profile.id,
          displayName: profile.displayName,
          userName: profile.displayName.split(" ")[0] + "_" + profile.id,
          image: null,
          profileType: "general"
        };

        try {
          // Seeing the user already there in the DB or not...  
          let user = await User.findOne({ registrationId: profile.id });

          if (user) {
            // If user is already in the Database...  
            done(null, user);
          } else {
            // If user is not in the Database (new user)...  
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );
};
