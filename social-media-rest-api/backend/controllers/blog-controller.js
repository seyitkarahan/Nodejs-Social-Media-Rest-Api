const mongoose = require("mongoose");
const Blog = require("../models/Blog.js");

const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = Blog.find();
    } catch (error) {
        return console.log(error);
    }
    if (!blogs) {
        return res.status(404).json({ message: "No Blog Found!" });
    }
    return res.status(200).json({ blogs })
};

const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;

    let existingUser;
    try {
        existingUser = await User.findById(user)
    } catch (error) {
        return console.log(error);
    }
    if (!existingUser) {
        return res.status(400).json({ message: "Unable To Find User By This Id" })
    }
    const blog = new Blog({
        title,
        description,
        image,
        user,
    });
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });
        await session.commitTransaction();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
    return res.status(200).json({ blog });
};

const updateBlog = async (req, res, next) => {
    const { title, description } = req.body;
    const blogId = req.params.id;

    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        })
    } catch (error) {
        return console.log(error);
    }
    if (!blog) {
        return res.status(500).json({ message: "Unable To Update The Blog" })
    }
    return res.status(200).json({ blog });
};

const getById = async (req, res, next) => {
    const id = req.params.id;

    let blog;
    try {
        blog = await Blog.findById(id)
    } catch (error) {
        return console.log(error);
    }
    if (!blog) {
        return res.status(404).json({ message: "No Blog Found" });
    }
    return res.status(200).json({ blog });
};

const deleteBlog = async (req, res, next) => {
    const id = req.params.id;

    let blog;
    try {
        blog = await Blog.findByIdAndRemove(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (error) {
        return console.log(error);
    }
    if (!blog) {
        return res.status(400).json({ message: "Unable To Delete" });
    }
    return res.status(200).json({ message: "Successfully Delete" });
};

const getByUser = async (req, res, next) => {
    const userId = req.params.id;

    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blog");
    } catch (error) {
        return console.log(error);
    }
    if (!userBlogs) {
        return res.status(404).json({ message: "No Blog Found" });
    }
    return res.status(200).json({ blogs: userBlogs });
};

module.exports = {
    getAllBlogs,
    addBlog,
    updateBlog,
    getById,
    deleteBlog,
    getByUser
}