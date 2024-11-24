import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from 'body-parser';

dotenv.config();
console.log('Identifier:', process.env.BLUESKY_IDENTIFIER);
console.log('Password:', process.env.BLUESKY_PASSWORD);

const app = express();
const BASE_URL = 'https://bsky.social/xrpc';

app.set('view engine', 'ejs');
// Configure Express middleware
// Does not set content types for contents if not set explicitly already
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));


// Define paths to view files
const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, "views/index.ejs");

// app.get('/', async (req, res) => {
//     try {
//       const identifier = process.env.BLUESKY_IDENTIFIER;
//       const password = process.env.BLUESKY_PASSWORD;
  
//       // Log the identifier and password for debugging
//       console.log('Identifier:', identifier);
//       console.log('Password:', password);
  
//       if (!identifier || !password) {
//         throw new Error('Identifier or password is missing. Check your .env file.');
//       }
  
//       // Step 1: Login to get a session token
//       const loginResponse = await axios.post(`${BASE_URL}/com.atproto.server.createSession`, {
//         identifier,
//         password,
//       });
  
//       const accessToken = loginResponse.data.accessJwt;
  
//       // Step 2: Fetch the user's feed
//       const feedResponse = await axios.get(`${BASE_URL}/app.bsky.feed.getTimeline`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
  
//       const feed = feedResponse.data.feed;
  
//       // Render the feed using EJS
//       res.render(indexPath, { feed });
//     } catch (error) {
//       console.error('Error fetching feed:', error.response?.data || error.message);
//       res.status(500).send('Error fetching feed.');
//     }
//   });


app.get('/', async (req, res) => {
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
      res.render(indexPath, { feed });
      console.log(feed)
    } catch (error) {
      console.error('Error fetching feed:', error.response?.data || error.message);
      res.status(500).send('Error fetching feed.');
    }
    // } catch (error) {
    //   console.error('Error fetching feed:', error.response?.data || error.message);
    //   res.render(indexPath, { feed: [], error: error.message });
    // }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
