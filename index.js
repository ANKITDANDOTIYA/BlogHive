const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const Blog = require('./models/blog.js');
const User = require('./models/user.js');


const userRoutes = require('./routes/user.js');
const blogRoutes = require('./routes/blog.js');

const { checkForAuthenticationCookie } = require('./middlewares/authentication.js');

const app = express();
const port = 8000;

mongoose.connect("mongodb://localhost:27017/blogHive")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Error connecting to MongoDB", err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({createdAt: -1}).populate("createdBy");
     
  res.render('home',{
    user: req.user,
    blogs: allBlogs
  });
});


app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});