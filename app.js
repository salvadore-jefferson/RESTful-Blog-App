var methodOverride = require("method-override"),
    sanitizer = require("express-sanitizer"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(sanitizer());


mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// INDEX ROUTE
app.get("/", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { blog: blogs });
        }
    });
});

// NEW ROUTE
app.get("/blog/new", function(req, res) {
    res.render("new");
});

// CREATE ROUTE
app.post("/blog", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/");
        }
    });
});

// SHOW ROUTE
app.get("/blog/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", { blog: foundBlog });
        }
    });
});

// EDIT ROUTE
app.get("/blog/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundBlog._id);
            res.render("edit", { blog: foundBlog });
        }
    });
});

// UPDATE ROUTE
app.put("/blog/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            res.redirect("/blog");
        }
        else {
            console.log(updatedBlog._id);
            res.redirect("/blog/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
app.delete("/blog/:id", function(req, res) {
    Blog.findOneAndDelete(req.params.id, function(err, deletedBlog) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(deletedBlog);
            res.redirect("/");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("RESTful Blog App Started");
});
