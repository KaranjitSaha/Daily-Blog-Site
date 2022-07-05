//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const posts = [];
const mongoose = require("mongoose");

// connecting MongoDB Atlas
mongoose.connect('mongodb+srv://KaranjitSaha:Kota%402020@cluster0.iytsg.mongodb.net/blogDB').then(() => console.log("connected to DB successfully")).catch((err) => console.log(err));

const postSchema=mongoose.Schema({
 title:String,
 body:String,
});

const Post=mongoose.model('Post',postSchema);




const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/posts/:var', function (req, res) {
  let flag = false;
  Post.find({},(err,docs)=>{
    docs.forEach(function (post) {
      if (lodash.lowerCase(post.title) === lodash.lowerCase(req.params.var)) {
        flag = true;
        let options = {
          heading:post.title,
          body:post.body};
          res.render(__dirname + '/views/post.ejs', options)
        console.log("Match Found!");
        }
      });
      if(flag==false)
        console.log("No Match Found!");
  });
  
});

app.get('/', function (req, res) {
  Post.findOne({title:"Home"},(err,doc)=>{
    if(err){
      console.log(err);
    }
    else if(!doc){
      posts.push({
        title:"Home",
        body:homeStartingContent,
      });
      const post=new Post({
        title:"Home",
        body:homeStartingContent,
      });
      post.save();
    }
    else{
      Post.find({},(err,docs)=>{
        const options = {
          posts: docs,
        }
        res.render(__dirname + '/views/home.ejs', options);
      });
    }
  });
  
  
  // res.render(__dirname + '/views/home.ejs', options);
});

app.get('/about', function (req, res) {
  const options = {
    aboutContent: aboutContent
  }
  res.render(__dirname + '/views/about.ejs', options);
});

app.get('/contact', function (req, res) {
  const options = {
    contactContent: contactContent
  }
  res.render(__dirname + '/views/contact.ejs', options);
});

app.get('/compose', function (req, res) {
  const options = {};
  res.render(__dirname + '/views/compose.ejs', options);
});

app.post('/compose', function (req, res) {
  const post=new Post({
    title: req.body.Title,
    body: req.body.Post,
  });
  post.save((err)=>{
    if(!err){
      res.redirect('/');
    }
  });
  
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port 3000");
});
