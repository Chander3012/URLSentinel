const express = require('express');
const axios = require('axios');
const validUrl = require('valid-url');
const dns = require('dns');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//ya sab main domains hai jo 18+ ads use kar ka scam kr ta hai
const SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  'goo.gl',
  't.co',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'adf.ly',
  'bit.do',
  'mcaf.ee'
];

// ya code inn ko detect krta hai
function isShortened(urlString) {
  try {
    const hostname = new URL(urlString).hostname.toLowerCase();
    return SHORTENERS.includes(hostname);
  } catch {
    return false;
  }
}

// ye check kr ta hai ki jo link tum na deya hai voh correct hai ki ni
async function isValidUrl(urlString) {
  if (!validUrl.isWebUri(urlString)) return false;
  const hostname = new URL(urlString).hostname;
  return new Promise((resolve) => {
    dns.lookup(hostname, (err) => {
      resolve(!err);
    });
  });
}


// ya main hai jo googel ka sath connnect hai check krta hai ki link safe hai ki ni
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


// ye voh api hia jo frontend ko backend ka sath connnect ke ta hai
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


// ya voh code hai jis pa backend server run kr rha hai 4000 port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
