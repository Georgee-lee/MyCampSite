var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//  Schma Setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//   name: "Granute Hill",
//   image: "https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/2997782/580/326/m1/fpnw/wm0/mountain-preview-2-.jpg?1500494058&s=40f110e701eac2ab184169301b8e7592",
//   description: "This is a huge granite hill, no bathrooms. No water, but Beautiful!"
// }, function(err, campground){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Newly Created campground!");
//     console.log(campground);
//   }
// });

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  //  Get all campgrounds from DB
  Campground.find({}, function(err, AllCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("index", {campgrounds: AllCampgrounds});  
    }
  });
});

app.post("/campgrounds", function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc}
  //  Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      // redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", function(req, res) {
   res.render("new.ejs"); 
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
   // find the campground with provided ID
   Campground.findById(req.params.id, function(err, foundCampground){
     if(err){
       console.log(err);
     } else {
       res.render("show", {campground: foundCampground});
     }
   });
});


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("The YelpCamp has Started!");
});