const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user.js');

const app = express();
const port = 8000;

mongoose.connect("mongodb://localhost:27017/blogHive")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Error connecting to MongoDB", err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
  res.render('home');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}));
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});