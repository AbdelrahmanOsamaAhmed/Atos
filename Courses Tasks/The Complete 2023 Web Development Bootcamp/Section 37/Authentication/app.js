//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const FacebookStrategy = require("passport-facebook").Strategy;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  "mongodb+srv://admin-abdo:abdo1234@cluster0.svkswrm.mongodb.net/authDB",
  { useNewUrlParser: true }
);
const userSchema = mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
});
const facebookUsersSchema = mongoose.Schema({
  email: String,
  password: String,
  facebookId: String,
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
/* facebookUsersSchema.plugin(passportLocalMongoose);
facebookUsersSchema.plugin(findOrCreate); */
const User = new mongoose.model("User", userSchema);
const FacebookUser = new mongoose.model("FacebookUser", facebookUsersSchema);
passport.use(User.createStrategy());
/* passport.use(FacebookUser.createStrategy()); */

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/secrets",
    },
    function (accessToken, refreshToken, profile, cb) {
      FacebookUser.findOrCreate(
        { facebookId: profile.id },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);
app.get("/", function (req, res) {
  res.render("home");
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get("/login", function (req, res) {
  res.render("login");
});
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/secrets");
  }
);
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/secrets",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
app.post("/login", function (req, res) {
  /* const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) res.render("secrets");
      });
    } else res.render("register");
  }); */
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) console.log(err);
    else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("secrets");
      });
    }
  });
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/secrets", (req, res) => {
  User.find({ secret: { $ne: null } }).then((users) => {
    if (users) {
      res.render("secrets", { usersWithSecrets: users });
    }
  });
});
app.post("/register", function (req, res) {
  /* bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser.save().then(res.render("secrets"));
  }); */
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("secrets");
        });
      }
    }
  );
});
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.get("/submit", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});
app.post("/submit", function (req, res) {
  const submittedSecret = req.body.secret;
  User.findById(req.user.id).then((user) => {
    if (user) {
      user.secret = submittedSecret;
      user.save();
      res.redirect("/secrets");
    }
  });
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
