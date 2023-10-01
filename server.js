const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const User = require("./model/User");

const app = express();
// Bodyparser Middleware
app.use(bodyParser.json());
// database
const Mong = "mongodb://localhost:27017/Rasheed";
mongoose.connect(Mong, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected");
});

// set engine view
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Add user to database
app.post("/add_user", (req, res) => {
  console.log(req.body); // check the request body
  const usersall = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  });
  usersall
    .save()
    .then(() => {
      console.log(usersall);
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving user to database");
    });
});

// Get all users from database
app.get("/", (req, res) => {
  User.find()
    .then((users) => {
      res.render("index", { users: users });
    })
    .catch((error) => {
      console.log(error);
    });
});

// Render add user form
app.get("/add_user", (req, res) => {
  res.render("add_user");
});

// Render edit user form
app.get("/edit_user/:id", (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      res.render("edit_user", { user: user });
    })
    .catch((error) => {
      console.log(error);
    });
});

// Update user in database
app.post("/edit_user/:id", (req, res) => {
  const userId = req.params.id;
  User.findByIdAndUpdate(
    userId,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  )
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
    });
});

// Delete user from database
app.post("/delete_user/:id", (req, res) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
    });
});

const port = 4000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
