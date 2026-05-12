// frontend/src/pages/ScanResult/index.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

import styles from './style.module.css';

const ScanResult = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const scannedUrl =
    location.state?.url || '';

  const [loading, setLoading] =
    useState(true);

  const [countdown, setCountdown] =
    useState(5);

  const [result, setResult] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [error, setError] =
    useState('');

  /*
  ==========================================
  API BASE
  ==========================================
  */

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:4000';

  /*
  ==========================================
  OFFICIAL DOMAINS
  ==========================================
  */

  const officialDomains = {

    instagram: 'instagram.com',

    whatsapp: 'whatsapp.com',

    facebook: 'facebook.com',

    amazon: 'amazon.com',

    flipkart: 'flipkart.com',

    telegram: 'telegram.org',

    youtube: 'youtube.com',

    twitter: 'twitter.com',

    linkedin: 'linkedin.com'
  };

  /*
  ==========================================
  REDIRECT IF URL EMPTY
  ==========================================
  */

  useEffect(() => {

    if (!scannedUrl) {
      navigate('/');
    }

  }, [scannedUrl, navigate]);

  /*
  ==========================================
  COUNTDOWN
  ==========================================
  */

  useEffect(() => {

    let timer;

    if (countdown > 0) {

      timer = setInterval(() => {

        setCountdown((prev) => prev - 1);

      }, 1000);

    } else {

      fetchScanAndPreview();
    }

    return () => clearInterval(timer);

  }, [countdown]);

  /*
  ==========================================
  MAIN SCAN FUNCTION
  ==========================================
  */

  const fetchScanAndPreview = async () => {

    try {

      setError('');
      setResult(null);
      setPreview(null);

      /*
      ======================================
      BASIC PHISHING DETECTION
      ======================================
      */

      const isPhishing =
        Object.entries(officialDomains).some(
          ([keyword, officialDomain]) => {

            const lowerUrl =
              scannedUrl.toLowerCase();

            return (
              lowerUrl.includes(keyword) &&
              !lowerUrl.includes(officialDomain)
            );
          }
        );

      /*
      ======================================
      PHISHING DETECTED
      ======================================
      */

      if (isPhishing) {

        setResult({

          safe: false,

          shortened:
            scannedUrl.includes('bit.ly') ||
            scannedUrl.includes('tinyurl'),

          threats: {

            phishing: true,

            impersonation:
              'This link pretends to be a trusted website.',

            suspiciousDomain:
              scannedUrl,

            details:
              'This URL resembles a known platform but is hosted on another domain.'
          }
        });

        setLoading(false);

        return;
      }

      /*
      ======================================
      SCAN URL
      ======================================
      */

      const res = await fetch(
        `${API_BASE}/api/check-url`,
        {

          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            url: scannedUrl
          })
        }
      );

      const data = await res.json();

      /*
      ======================================
      HANDLE ERROR
      ======================================
      */

      if (!res.ok) {

        setError(
          data.error ||
          'Failed to scan URL'
        );

        setLoading(false);

        return;
      }

      /*
      ======================================
      SAVE RESULT
      ======================================
      */

      setResult(data);

      /*
      ======================================
      FETCH WEBSITE PREVIEW
      ======================================
      */

      if (data.safe) {

        try {

          const previewRes = await fetch(
            `${API_BASE}/api/link-preview`,
            {

              method: 'POST',

              headers: {
                'Content-Type': 'application/json'
              },

              body: JSON.stringify({
                url: scannedUrl
              })
            }
          );

          const previewData =
            await previewRes.json();

          setPreview(previewData);

        } catch (previewError) {

          console.error(
            'Preview Error:',
            previewError
          );
        }
      }

    } catch (err) {

      console.error(err);

      setError(
        'Network error or backend not running'
      );

    } finally {

      setLoading(false);
    }
  };

  /*
  ==========================================
  GO BACK
  ==========================================
  */

  const handleGoBack = () => {

    navigate('/');
  };

  return (

    <div className={styles.wrapper}>

      <Navbar />

      <main className={styles.scanResultMain}>

        <h1>
          Scan Result
        </h1>

        <p className={styles.urlDisplay}>

          <strong>
            URL Scanned:
          </strong>

          {' '}

          {scannedUrl}

        </p>

        <section className={styles.resultSection}>

          {
            loading &&
            countdown > 0 &&
            (
              <>
                <p>
                  🔍 Initializing Scan...
                </p>

                <p>
                  ⏳ Please wait:
                  {' '}
                  <strong>
                    {countdown}
                  </strong>
                  {' '}
                  seconds remaining
                </p>
              </>
            )
          }

          {
            !loading &&
            error &&
            (
              <p className={styles.unsafe}>
                ⚠️ {error}
              </p>
            )
          }

          {
            !loading &&
            result?.safe &&
            (
              <>
                <p className={styles.safe}>
                  ✅ This link is safe!
                </p>

                {
                  preview
                    ? (
                      <div className={styles.previewCard}>

                        {/* SCREENSHOT */}

                        {
                          preview.screenshot &&
                          (
                            <img
                              src={preview.screenshot}
                              alt="Website Screenshot"
                              style={{
                                width: '100%',
                                borderRadius: '16px',
                                marginBottom: '20px'
                              }}
                            />
                          )
                        }

                        {/* WEBSITE IMAGE */}

                        {
                          preview.image &&
                          (
                            <img
                              src={preview.image}
                              alt="Website Preview"
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '16px',
                                marginBottom: '16px'
                              }}
                            />
                          )
                        }

                        <h3>
                          {preview.title}
                        </h3>

                        <p>
                          {preview.description}
                        </p>

                        <div
                          style={{
                            marginTop: '12px',
                            opacity: 0.7
                          }}
                        >
                          {preview.url}
                        </div>

                      </div>
                    )
                    : (
                      <p>
                        No preview available
                      </p>
                    )
                }

                <a
                  href={scannedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.visitLink}
                >
                  Visit Site
                </a>
              </>
            )
          }

          {
            !loading &&
            result &&
            !result.safe &&
            (
              <>
                <p className={styles.unsafe}>
                  ⚠️ Warning! This link is unsafe or suspicious.
                </p>

                {
                  result.shortened &&
                  (
                    <p style={{ color: 'orange' }}>
                      ⚠️ This URL is shortened.
                      Please be careful.
                    </p>
                  )
                }

                {
                  result.threats &&
                  (
                    <pre
                      style={{
                        background: '#ffe5e5',
                        padding: '12px',
                        borderRadius: '10px',
                        color: '#b30000',
                        overflowX: 'auto'
                      }}
                    >
                      {
                        JSON.stringify(
                          result.threats,
                          null,
                          2
                        )
                      }
                    </pre>
                  )
                }

              </>
            )
          }

          {
            !loading &&
            (
              <button
                onClick={handleGoBack}
                className={styles.backButton}
              >
                Go Back
              </button>
            )
          }

        </section>

      </main>

      <Footer />

    </div>
  );
};

export default ScanResult;