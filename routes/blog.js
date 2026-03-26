const { Router } = require("express");
const multer = require('multer');
const path = require('path');

const Blog = require('../models/blog');
const Comment = require('../models/comment');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null,  path.join(__dirname, "../public/uploads"));
    },
    filename: function(req, file, cb){
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = Router();


router.get("/add-new", (req, res) => {
    return res.render("addBlog", { user: req.user });
});


router.post("/",upload.single('coverImage') ,async (req, res) => {
    const { title, body } = req.body;
     
    const blog = await Blog.create({
        title,
        body,
        coverImage: req.file ? "/uploads/" + req.file.filename : undefined,
        createdBy: req.user._id,
    });

    return res.redirect("/");
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("createdBy");
    const comments = await Comment.find({ blogId: id }).populate("createdBy");
    // blog.comments = comments;
    console.log(comments);
    return res.render("blog", { blog, comments, user: req.user });
});


router.post('/comment/:id', async (req, res) => {
    const comment = await Comment.create({
        content: req.body.comment,
        createdBy: req.user._id,
        blogId : req.params.id,
    });

    return res.redirect("/blog/" + req.params.id);
    });



module.exports = router;