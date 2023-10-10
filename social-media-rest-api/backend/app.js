const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes.js");
const blogRouter = require("./routes/blog-routes.js");

const app = express();
app.use(express.json());
app.use("/api/user", router);
app.use("/api/blog", blogRouter);

mongoose
    .connect("mongodb://localhost:27017")
    .then((result) => app.listen(5000))
    .then(() => console.log("Connected to mongodb"))
    .catch((err) => console.log(err));
