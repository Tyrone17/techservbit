import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { mongoose } from "mongoose";
import fetch from 'node-fetch';
import { marked } from "marked";

const app = express();
const port = 1700;

mongoose.set("strictQuery", false);
// Set the view engine to EJS
app.set('view engine', 'ejs');
// Configure Express middleware
// Does not set content types for contents if not set explicitly already
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
// TODO: main.js in public folder not loading 
//  Done: explicitly set the Content-Type header
app.get('/public/main.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/public/main.js');
});

app.get('/public/display.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/public/display.js');
});

// TODO: techservit_about.json in public folder not loading 
//  Done: explicitly set the Content-Type header
app.get('/data/techservit_about.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(__dirname + '/data/techservit_about.json');
});

app.get('/data/privacy_tos.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(__dirname + '/data/privacy_tos.json');
});

// Define paths to view files
const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, "index.ejs");
const homePath = join(__dirname, "views/home.ejs");
const blogDetailsPath = join(__dirname, "views/blogDetails.ejs");
const privacy = join(__dirname, "views/privacy.ejs");
const terms = join(__dirname, "views/terms.ejs")

// Initialize blog list
let blogList = [];

// Connect to Mongodb
mongoose.connect("mongodb+srv://techserv20:6stJikPdLeKhVpUf@tsbit.eisfnnw.mongodb.net/article").then(()=>{
  console.log("MongoDB service running")
}).catch((err)=>{
  console.log(err);
});

// Schema
// const bPostsSchema = new mongoose.Schema({
//   fid: String,
//   title: String,
//   description: String,
//   timestamp: String
// })
const bPostsSchema = new mongoose.Schema({
  articleTitle: String,
  articleContent: String,
  author: String,
  timestamp: String,
  source: String,
  dateCreated: String
})

// Schema model
// const bPostModel = mongoose.model("blogposts", bPostsSchema);
const bPostModel = mongoose.model("articles", bPostsSchema);

// Render index page
app.get("/", (req, res) => {
  res.render(indexPath);
});

// Render home page with blog list
app.get("/home", (req, res) => {
  // res.render(homePath, {
  //   blogList: blogList,
  // });
  // Read the entire collection
  bPostModel.find({})
  .then(posts => {
    // console.log('blogposts:', posts);
    // const dbData = JSON.parse(posts)
    res.render(homePath, {
      blogList: blogList,
      // checklist,
      posts
    });
  })
  .catch(error => {
    console.log('Error fetching MongoDB collection:', error);
  });
});

// Render policies page
app.get('/privacy', async (req, res) => {
  // var privacyPolicy = {};
  try {
    const response = await fetch('http://127.0.0.1:1700/data/privacy_tos.json');
    const policies = await response.json(); // Correctly declared as `const`
    
    res.render(privacy, {
      privacyPolicy: policies.privacyPolicy,
    });
  } catch (err) {
    console.error('Error fetching policies JSON:', err);
    res.status(500).send('Server Error');
  }
});

// Render terms page
app.get('/terms', async (req, res) => {
  // var privacyPolicy = {};
  try {
    const response = await fetch('http://127.0.0.1:1700/data/privacy_tos.json');
    const policies = await response.json(); // Correctly declared as `const`
    
    res.render(terms, {
      termsOfUse: policies.termsOfUse
    });
  } catch (err) {
    console.error('Error fetching policies JSON:', err);
    res.status(500).send('Server Error');
  }
});

// Add new blog
app.post("/home", (req, res) => {
  const blogTitle = req.body.blogTitle;
  const blogDescription = req.body.blogDes;

  bPostModel.find({})
  .then(posts => {
    // console.log('blogposts:', posts);
    // const dbData = JSON.parse(posts)
    // res.render(homePath, {
    //   // blogList: blogList,
    //   posts
    // });
    res.render(homePath, {
      blogList: blogList,
      posts
    });
  })
  .catch(error => {
    console.log('Error fetching MongoDB collection:', error);
  });

  blogList.push({
    fid: generateID(),
    title: blogTitle,
    description: blogDescription,
  });

  const newPost = new bPostModel({
    title: blogTitle,
    description: blogDescription,
    timestamp: new Date().toLocaleDateString() +" "+ new Date().toLocaleTimeString()
  })

  // Save the user to the database
  newPost.save()
  .then(() => console.log('User saved!'))
  .catch((error) => console.log('Error saving user:', error));

});

// Delete a blog
app.post("/delete/:id", (req, res) => {
  const blogId = req.params.id;
  blogList = blogList.filter((blog) => blog.id !== parseInt(blogId));
  res.send(
    '<script>alert("Blog deleted successfully"); window.location="/home";</script>'
  );
  res.redirect("/home");
});

// Render blog details page
app.get("/blogDetails/:id", (req, res) => {
  const blogId = req.params.id;
  const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
  bPostModel.find({})
  .then(posts => {
    // console.log('blogposts:', posts);
    // const dbData = JSON.parse(posts)
    
    res.render(blogDetailsPath,{
      blogDetails:blogDetails,
      // checklist,
      posts
    });
  })
});

// app.get('/blog/:id', (req, res) => {
//   const blogId = req.params.id;
//   // Assuming you fetch the blog post using the blogId
//   Blog.findById(blogId, (err, blogDetails) => {
//     if (err || !blogDetails) {
//       return res.status(404).send("Blog not found");
//     }
//     res.render('blogDetails', { blogDetails });
//   });
// });



// Render edit blog page
app.get("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
  res.render(indexPath, {
    isEdit: true,
    blogDetails: blogDetails,
  });
});

// Update blog
app.post("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const editBlog = blogList.findIndex((blog) => blog.id === parseInt(blogId));
  if (editBlog === -1) {
    res.send("<h1> Something went wrong </h1>");
  }
  const updatedTitle = req.body.blogTitle;
  const updatedDescription = req.body.blogDes;

  const blogTitle = (blogList[editBlog].title = updatedTitle);
  const blogDescription = (blogList[editBlog].description = updatedDescription);
  [...blogList, { blogTitle: blogTitle, blogDescription: blogDescription }];

  res.render(homePath, {
    isEdit: true,
    blogList: blogList,
  });
});

// Function to generate random ID
function generateID() {
  return Math.floor(Math.random() * 10000);
}

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  
});

// const start  = async () => {
  // await mongoose.connect('mongodb+srv://techserv20:6stJikPdLeKhVpUf@tsbit.eisfnnw.mongodb.net/sample_mflix');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }

// start()