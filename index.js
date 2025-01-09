import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { mongoose } from "mongoose";
import fetch from 'node-fetch';
import nodemailer from "nodemailer";
import axios from 'axios';
import dotenv from 'dotenv';
// import {TwitterApi, TwitterApiv2} from "twitter-api-v2";
// import { marked } from "marked";

const app = express();
const port = 1700;
const BASE_URL = 'https://bsky.social/xrpc';
dotenv.config();

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

app.get('/public/jojo.png', (req, res) => {
  // res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/public/jojo.png');
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
const socials = join(__dirname, "views/socials.ejs")
const contact = join(__dirname, "views/contact.ejs")

// Initialize blog list
let blogList = [];

// Twitter API client
// const twitterClient = new TwitterApi({
//   // nuCbs2y7hRrnbEU0IR75RiObA
//   appKey: 'nuCbs2y7hRrnbEU0IR75RiObA',
//   // eyXYUNEPQ8acUcj7aOR2i4zCua8wcc8KNZ4uE2Qdn6ew8G8Kwr
//   appSecret: 'eyXYUNEPQ8acUcj7aOR2i4zCua8wcc8KNZ4uE2Qdn6ew8G8Kwr',
//   // 249515150-slBRB5QnlxUTNwpkdg39CUkWkA3y7oYMVbajggZO
//   accessToken: '249515150-slBRB5QnlxUTNwpkdg39CUkWkA3y7oYMVbajggZO',
//   // nyLnAcNsy14BOPMrxmS9Ns0eEhH7hmOTFVo4gSffeRZmz
//   accessSecret: 'nyLnAcNsy14BOPMrxmS9Ns0eEhH7hmOTFVo4gSffeRZmz',
// });

// const client = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAHRuxAEAAAAAKL3ljI8SDQ1GzzTJxO6Vg2PTVsc%3D6xzAy2syypN568xfzJ06Fr7TBuGTQ72zxcv1bnyU7RuNlY54ZX');

// async function getUserId(username) {
//   try {
//     const user = await client.v2.userByUsername(username);
//     return user.data.id; // This is the numeric user ID
//   } catch (error) {
//     console.error('Error fetching user ID:', error);
//   }
// }

// getUserId('Tyrone_Maasdorp').then((id) => console.log('User ID:', id));

// async function fetchTweets() {
//   try {
//     const tweets = await client.v2.userTimeline('249515150', { max_results: 5 });
//     console.log(tweets);
//   } catch (error) {
//     if (error.code === 429) {
//       console.error(`Rate limit exceeded. Try again after: ${new Date(error.rateLimit.reset * 1000)}`);
//     } else {
//       console.error('Error fetching tweets:', error);
//     }
//   }
// }
// fetchTweets();


// Connect to Mongodba instance
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

// Render contact page
app.get("/contact", (req, res) => {
  res.render(contact);
});

// const transporter = nodemailer.createTransport({
//   host: 'mail.techservit.co.za', // Your domain's mail server
//   port: 587, // Port for STARTTLS
//   secure: false, // Use true for port 465, false for 587
//   auth: {
//     user: 'info@techservit.co.za', // Your domain email address
//     pass: 'your-email-password', // The password for the email account
//   },
//   tls: {
//     rejectUnauthorized: false, // Allow self-signed certificates if necessary
//   },
// });


// Create route to handle the email object
app.post('/send-email', async (req, res) => {
  const { name, email, number, message, requestType, numberType  } = req.body;
  const uid = generateID();
  try {
    // Set up nodemailer transport with your email service
      const transporter = nodemailer.createTransport({
        host: '156.155.253.182', // Your domain's mail server
        port: 587, // Port for STARTTLS
        secure: false, // Use true for port 465, false for 587
        auth: {
          user: 'info', // Your domain email address
          pass: 'tsbword', // The password for the email account
        },
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates if necessary
        },
    });

    // Set up email data
    const mailOptions = {
      from: email, // sender's email address (user's input) = techserv20@gmail.com
      to: 'info@techservit.co.za', // recipient's email address = info@techservit.co.za (it creates the lead into new business)
      subject: `New Customer Request - ${uid}`,
      text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\n\nNumber_Type: ${numberType}\nNumber: ${number}\nRequest_Type: ${requestType}\nMessage: ${message}\nUID: ${uid}`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send success response to the user
    // res.send('Email sent successfully!');
    res.send(
      '<script>alert("Your query was sent to us successfully!"); window.location="/";</script>'
    );
    // res.redirect("/");
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email. Please try again later.');
  }
});

// Function to generate random ID
function generateID() {
  return Math.floor(Math.random() * 10000);
}

// Render socials page
// app.get("/socials", (req, res) => {
//   const test = "@Tyrone_Maasdorp";
//   res.render(socials, test);
// });
app.get('/socials', async (req, res) => {
  // const xHandle = '@Tyrone_Maasdorp'; // Your X handle
  // res.render(socials, { xHandle });  // Pass as an object
  // try {
    // const tweets = await twitterClient.v2.userTimeline('@Tyrone_Maasdorp', {
    //   max_results: 5, // Fetch the latest 5 tweets
    // });
    // res.render(socials, { tweets: tweets.data });
    // res.render(socials, {xHandle:xHandle});
  // } catch (err) {
    // console.error(err);
    // res.render(socials, { tweets: [] , xHandle, fetchTweets:fetchTweets()}); // Render without tweets on error
    // res.render(socials, {xHandle:xHandle}); // Render without tweets on error
  // }
  // try {
  //   const response = await axios.get('https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed', {
  //       headers: { Authorization: `Bearer YOUR_ACCESS_TOKEN` },
  //       params: { actor: 'techservit' }
  //   });

  //   // Pass the feed data to the EJS template
  //   res.render(socials, { posts: response.data.feed });
  // } catch (error) {
  //     console.error('Error fetching feed:', error);
  //     res.status(500).send('Error fetching feed');
  // }

  const authorHandle = 'techservit.bsky.social'; // Replace with your handle
    const identifier = process.env.BLUESKY_IDENTIFIER;
    const password = process.env.BLUESKY_PASSWORD;
  
      // Log the identifier and password for debugging
      console.log('Identifier:', identifier);
      console.log('Password:', password);
  
      if (!identifier || !password) {
        throw new Error('Identifier or password is missing. Check your .env file.');
      }
  
      // Step 1: Login to get a session token
      const loginResponse = await axios.post(`${BASE_URL}/com.atproto.server.createSession`, {
        identifier,
        password,
      });
  
      const accessToken = loginResponse.data.accessJwt;

    try {
    //   // Fetch author feed
    //   const response = await axios.get(`${BASE_URL}/app.bsky.feed.getAuthorFeed`, {
    //     params: { actor: authorHandle },
    //     headers: {
    //                   Authorization: `Bearer ${accessToken}`,
    //                 },
    //   });
    //   const feed = response.data.feed || []; // Extract posts from the feed
    //   res.render(indexPath, { feed });
    // Step 2: Fetch the user's feed
      const feedResponse = await axios.get(`${BASE_URL}/app.bsky.feed.getAuthorFeed`, {
        params: { actor: authorHandle },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const feed = feedResponse.data.feed;
  
      // Render the feed using EJS
      res.render(socials, { feed });
      console.log(feed)
    } catch (error) {
      console.error('Error fetching feed:', error.response?.data || error.message);
      res.status(500).send('Error fetching feed.');
    }
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

  // Save the post to the database
  newPost.save()
  .then(() => console.log('Post saved!'))
  .catch((error) => console.log('Error saving Post:', error));

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
  const currentUrl = req.originalUrl; 
  bPostModel.find({})
  .then(posts => {
    // console.log('blogposts:', posts);
    // const dbData = JSON.parse(posts)
    
    res.render(blogDetailsPath,{
      blogDetails:blogDetails,
      // checklist,
      posts, currentUrl
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

// Start the server-side application
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  
});

// const start  = async () => {
  // await mongoose.connect('mongodb+srv://techserv20:6stJikPdLeKhVpUf@tsbit.eisfnnw.mongodb.net/sample_mflix');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }

// start()