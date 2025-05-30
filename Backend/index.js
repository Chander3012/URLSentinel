const express = require('express');
const axios = require('axios');
const validUrl = require('valid-url');
const dns = require('dns');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Allow your frontend (Vercel) to connect with this backend
app.use(cors({
  origin: 'https://url-sentinel-5xx5e0cmz-chander3012s-projects.vercel.app/', // 🔁 Replace with your real frontend URL
  credentials: true
}));

app.use(express.json());

/*
  🔐 These are scammy URL shorteners often used for 18+ or malicious ads
*/
const SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co',
  'ow.ly', 'is.gd', 'buff.ly', 'adf.ly',
  'bit.do', 'mcaf.ee'
];

/*
  🔍 This checks if a URL is a known shortener
*/
function isShortened(urlString) {
  try {
    const hostname = new URL(urlString).hostname.toLowerCase();
    return SHORTENERS.includes(hostname);
  } catch {
    return false;
  }
}

/*
  ✅ This checks if the URL is valid and real (domain exists)
*/
async function isValidUrl(urlString) {
  if (!validUrl.isWebUri(urlString)) return false;

  const hostname = new URL(urlString).hostname;
  return new Promise((resolve) => {
    dns.lookup(hostname, (err) => {
      resolve(!err);
    });
  });
}

/*
  🔐 (Optional) Use Google Safe Browsing API to check if link is dangerous
*/
async function checkGoogleSafeBrowsing(urlToCheck) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('Google API key missing');

  const requestBody = {
    client: {
      clientId: "yourapp",
      clientVersion: "1.0"
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: urlToCheck }]
    }
  };

  const response = await axios.post(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
    requestBody
  );

  return response.data;
}

/*
  📡 API endpoint for your frontend to call
*/
app.post('/api/check-url', async (req, res) => {
  try {
    const { url: urlToCheck } = req.body;

    if (!urlToCheck || typeof urlToCheck !== 'string') {
      return res.status(400).json({ error: 'Invalid URL input' });
    }

    const valid = await isValidUrl(urlToCheck);
    if (!valid) {
      return res.status(400).json({ error: 'URL is not valid or domain not found' });
    }

    const shortened = isShortened(urlToCheck);
    if (shortened) {
      return res.json({
        safe: false,
        message: 'Shortened URLs detected. Please provide the expanded URL for accurate scanning.',
        shortened: true,
        url: urlToCheck
      });
    }

    // Optional: Uncomment this to use Google Safe Browsing API
    // const googleResult = await checkGoogleSafeBrowsing(urlToCheck);
    // if (googleResult && googleResult.matches) {
    //   return res.json({
    //     safe: false,
    //     message: 'URL is flagged as unsafe by Google Safe Browsing',
    //     threats: googleResult.matches
    //   });
    // }

    return res.json({
      safe: true,
      message: 'URL appears safe',
      shortened: false,
      url: urlToCheck
    });
  } catch (error) {
    console.error('Error in /api/check-url:', error.message, error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
  🚀 Start the backend server on port 4000 (or env PORT)
*/
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
