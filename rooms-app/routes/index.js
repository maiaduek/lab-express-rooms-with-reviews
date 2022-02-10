const router = require("express").Router();
const bcrypt = require('bcryptjs')

const User = require('../models/User.model');
const Room = require('../models/Room.model');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


// SigningUp
router.get("/signup", function (req, res) {
  res.render("user/signup")
});

router.post("/signup", (req, res) => {
  let errors = [];

  if (!req.body.password) {
    errors.push("You need to make a password")
  }
  console.log(req.body.password)
  if (!req.body.email) {
    errors.push("Please provide an email")
  }

  if (!req.body.fullName) {
    errors.push("Please tell us your full name")
  }

  if (errors.length > 0) {
    console.log("ERRORS SIGNING UP", errors)
    return res.render("user/signup", {error: errors})
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync(req.body.password, salt)

  User.create({
    email: req.body.email,
    password: hashedPass,
    fullName: req.body.fullName
  })
  .then(createdUser => {
    console.log("User was created, woo!", createdUser)
    res.render('user/profile', createdUser)

    // Add session
    req.session.user = createdUser;
  })
  .catch(err => console.log("ERROR CREATING USER::", err))
})


router.get('/login', (req, res) => res.render('user/login'));

router.post('/login', (req, res) => {
  let errorMessage = "Check email or password";
  if (!req.body.email || !req.body.password) {
    return res.render('user/login', {errorMsg: errorMessage})
  }

  User.findOne({email: req.body.email})
  .then(foundUser => {
    if (!foundUser){
      errorMessage = "User cant be found";
      return res.render('user/login', {errorMsg: errorMessage})
    } else {
      req.session.user = foundUser;
      res.render('user/profile', foundUser)
    }
  })
})

// Logout
router.get('/logout', (req,res) => {
  req.session.destroy()
  res.redirect('/');
})

// Only access profile if logged in
router.get('/profile', (req, res) => {
  console.log("REQ SESSION:::", req.session)
  if (req.session?.user?.email) {
    res.render('user/profile', req.session.user)
  } else {
    res.render('user/not-logged-in')
  }
})



// ROOMS
router.get('/create-room', (req, res) => {
  if (req.session?.user?.email) {
    res.render('room/create-room', req.session.user)
  } else {
    res.render('user/not-logged-in')
  }
})

router.post('/create-room', (req,res) => {
  if (req.session?.user?.email) {
    res.render('room/create-room', req.session.user)
  } else {
    res.render('user/not-logged-in')
  }

  Room.create({
    name: req.body.name,
    description: req.body.description,
    owner: req.user._id
    // ADD REVIEW
  })
  .then(newRoom => {
    console.log("NEW ROOM::", newRoom)
    res.redirect("/profile")
  })
  .catch(err => console.log("ERROR CREATING NEW ROOM::", err))
})







module.exports = router;
