var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
// localtunnel = require("localtunnel");


//appsetup
// var uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox-6zj5i.mongodb.net/moviesdb?retryWrites=true";
// var uri = "mongodb://leo:leo12515@ds061839.mlab.com:61839/moviesdb12515?retryWrites=true";
var uri = "mongodb://leo:leo12515@ds061839.mlab.com:61839/moviesdb12515";
mongoose.connect(uri, { useNewUrlParser: true }, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Connected to Mongo DB Cluster Sandbox");
    }
});

// //tunnelsetup
// var tunnel = localtunnel(3000, { subdomain: "moviedb" }, function(err, tunnel) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("\n Tunnel Started\n" + tunnel.url);
//         tunnel.url;
//     }
// });
// tunnel.on('close', function() {
//     console.log("Tunnel Closed")
// });

mongoose.set('useFindAndModify', false);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongo setup
var movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    rated: String,
    runtime: Number,
    countries: Array,
    genres: Array,
    director: String,
    writers: Array,
    actors: Array,
    plot: String,
    poster: String,
    imdb: Object,
    tomato: Object,
    metacritic: Number,
    awards: Object,
    type: String
});

var movie = mongoose.model("moviedetail", movieSchema);

//index
app.get("/", function(req, res) {
    res.redirect("/movie");
});

app.get("/movie", function(req, res) {
    res.redirect("/movie/all/1");
    // movie.find({}, function(err, foundmovie) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         alert("Index");
    //         res.render("index", { movie: foundmovie });
    //     }
    // });

});

//new
app.get("/movie/new", function(req, res) {
    res.render("new");
});

//POST
app.post("/movie", function(req, res) {
    req.body.movie.plot = req.sanitize(req.body.movie.plot);
    movie.create(req.body.movie, function(err, newmovie) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/movie");
        }
    });
});

//show
app.get("/movie/:id", function(req, res) {
    movie.findById(req.params.id, function(err, foundmovie) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", { showmovie: foundmovie });
        }
    });
});

//edit
app.get("/movie/:id/edit", function(req, res) {
    movie.findById(req.params.id, function(err, updatedmovie) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("edit", { editmovie: updatedmovie });
        }
    });
});

//update
app.put("/movie/:id", function(req, res) {
    req.body.movie.plot = req.sanitize(req.body.movie.plot);
    movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updatedmovie) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/movie/" + req.params.id);
        }
    });
});

//delete
app.delete("/movie/:id", function(req, res) {
    movie.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/movie");
        }
    });
});

//Pagination
app.get('/movie/all/:page', function(req, res) {
    var pageNo = parseInt(req.params.page) || 1; // parseInt(req.query.pageNo)
    var size = 10;
    var query = {},
        response;
    if (pageNo < 0 || pageNo === 0) {
        res.redirect("back");
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    query.sort = "awards.wins";

    // Find some documents
    movie.find({}, { title: 1, poster: 1, plot: 1, year: 1 }, query, function(err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = { "error": true, "message": "Error fetching data" };
        }
        else {
            movie.estimatedDocumentCount().exec(function(err, count) {
                if (err) {
                    console.log(err);
                    return err;
                }
                else {
                    res.render("index", { movie: data, current: pageNo, pages: Math.ceil(count / size) });
                }
            });


        }

    });
});

// app.get('/movie/all/:page', function(req, res) {
//     var pageNo = parseInt(req.params.page) || 1; // parseInt(req.query.pageNo)
//     var size = 10;
//     var query = {},
//         response;
//     if (pageNo < 0 || pageNo === 0) {
//         // response = { "error": true, "message": "invalid page number, should start with 1" };
//         // console.log(response);
//         // return res.json(response);
//         res.redirect("back");
//     }
//     query.skip = size * (pageNo - 1);
//     query.limit = size;
//     // Find some documents

//     movie.find({}, { title: 1, poster: 1, plot: 1, year: 1 }).skip(pageNo > 0 ? ((pageNo - 1) * size) : 0).limit(size).exec(function(err, data) {
//         if (err) {
//             response = { "error": true, "message": "Error fetching data" };
//         }
//         else {
//             movie.estimatedDocumentCount().exec(function(err, count) {
//                 if (err) {
//                     console.log(err);
//                     return err;
//                 }
//                 else {
//                     res.render("index", { movie: data, current: pageNo, pages: Math.ceil(count / size) });
//                 }
//             });


//         }
//     });
//     // movie.find({}, { _id: 1, title: 1, poster: 1, plot: 1, year: 1 }, query, function(err, data) {
//     //     // Mongo command to fetch all data from collection.
//     //     if (err) {
//     //         response = { "error": true, "message": "Error fetching data" };
//     //     }
//     //     else {
//     //         movie.estimatedDocumentCount().exec(function(err, count) {
//     //             if (err) {
//     //                 console.log(err);
//     //                 return err;
//     //             }
//     //             else {
//     //                 res.render("index", { movie: data, current: pageNo, pages: Math.ceil(count / size) });
//     //             }
//     //         });


//     //     }

//     // });
// });

//listen
var server = app.listen(process.env.PORT, process.env.IP, function() {
    var port = server.address().port;
    console.log("Server Started at port: " + port);
});
