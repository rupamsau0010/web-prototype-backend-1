// Getting the depandencies

const GoogleStrategy = require("passport-google-oauth20");

// Getting the local depandencies

const GoogleUser = require("../models/GoogleUsers");

// Setting up the passport module

module.exports = function (passport, req, res) {
  // Use of SerializerUser and DeserializerUser...
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    GoogleUser.findById(id, (err, user) => done(err, user));
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        // Creating the new user docs in json format...

        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          userName: profile.name.givenName + "_" + profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };

        console.log(newUser);

        try {
          // Seeing the user already there in the DB or not...
          let user = await GoogleUser.findOne({ googleId: profile.id });

          if (user) {
            // If user is already in the Database...
            done(null, user);
          } else {
            // If user is not in the Database (new user)...
            user = await GoogleUser.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );
};
