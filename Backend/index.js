const express = require('express');
const axios = require('axios');
const validUrl = require('valid-url');
const dns = require('dns');
const cors = require('cors');

require('dotenv').config();

const app = express();

/*
==================================================
✅ ALLOWED ORIGINS
==================================================
*/

const allowedOrigins = [
  'http://localhost:5173',
  'https://url-sentinel.vercel.app'
];

/*
==================================================
✅ CORS
==================================================
*/

app.use(cors({

  origin: function (origin, callback) {

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error('Not allowed by CORS')
    );
  },

  methods: ['GET', 'POST', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],

  credentials: true
}));

/*
==================================================
✅ JSON PARSER
==================================================
*/

app.use(express.json());

/*
==================================================
🔐 SHORT URL DOMAINS
==================================================
*/

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

/*
==================================================
🔍 CHECK SHORT URL
==================================================
*/

function isShortened(urlString) {

  try {

    const hostname =
      new URL(urlString)
        .hostname
        .toLowerCase();

    return SHORTENERS.includes(hostname);

  } catch {

    return false;
  }
}

/*
==================================================
✅ VALIDATE URL
==================================================
*/

async function isValidUrl(urlString) {

  if (!validUrl.isWebUri(urlString)) {
    return false;
  }

  const hostname =
    new URL(urlString).hostname;

  return new Promise((resolve) => {

    dns.lookup(hostname, (err) => {

      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }

    });

  });
}

/*
==================================================
📡 URL CHECK API
==================================================
*/

app.post('/api/check-url', async (req, res) => {

  try {

    const { url: urlToCheck } = req.body;

    if (
      !urlToCheck ||
      typeof urlToCheck !== 'string'
    ) {

      return res.status(400).json({
        error: 'Invalid URL input'
      });
    }

    const valid =
      await isValidUrl(urlToCheck);

    if (!valid) {

      return res.status(400).json({

        error:
          'URL is not valid or domain not found'
      });
    }

    const shortened =
      isShortened(urlToCheck);

    if (shortened) {

      return res.json({

        safe: false,

        shortened: true,

        url: urlToCheck,

        message:
          'Shortened URLs detected. Please be careful.'
      });
    }

    return res.json({

      safe: true,

      shortened: false,

      url: urlToCheck,

      message: 'URL appears safe'
    });

  } catch (error) {

    console.error(
      'CHECK URL ERROR:',
      error.message
    );

    return res.status(500).json({

      error: 'Internal Server Error'
    });
  }
});

/*
==================================================
🌐 MICROLINK PREVIEW API
==================================================
*/

app.post(
  '/api/link-preview',
  async (req, res) => {

    try {

      const { url } = req.body;

      if (!url) {

        return res.status(400).json({
          error: 'URL is required'
        });
      }

      /*
      ========================================
      FETCH MICROLINK DATA
      ========================================
      */

      const response = await axios.get(
        'https://api.microlink.io/',
        {
          params: {
            url
          }
        }
      );

      /*
      ========================================
      EXTRACT DATA
      ========================================
      */

      const data = response.data.data;

      return res.json({

        title:
          data.title || '',

        description:
          data.description || '',

        image:
          data.image?.url || '',

        url:
          data.url || url
      });

    } catch (error) {

      console.log(
        'MICROLINK ERROR:',
        error.response?.data ||
        error.message
      );

      return res.status(500).json({

        error:
          'Failed to fetch preview'
      });
    }
  }
);

/*
==================================================
🏠 HOME ROUTE
==================================================
*/

app.get('/', (req, res) => {

  return res.json({

    success: true,

    message:
      'URL Sentinel Backend Running'
  });
});

/*
==================================================
🚀 START SERVER
==================================================
*/

const PORT =
  process.env.PORT || 4000;

app.listen(PORT, () => {

  console.log(
    `✅ Server running on port ${PORT}`
  );
});