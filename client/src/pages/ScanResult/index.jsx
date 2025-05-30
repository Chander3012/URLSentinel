import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './style.module.css';

const ScanResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const scannedUrl = location.state?.url || '';
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

 const officialDomains = {
  instagram: 'instagram.com',
  whatsapp: 'whatsapp.com',
  facebook: 'facebook.com',
  amazone: 'Amazone.com',
  Amazone: 'Amazone.in',
  Flipkart:'flipkart.com',
};

  useEffect(() => {
    if (!scannedUrl) {
      navigate('/');
    }
  }, [scannedUrl, navigate]);

  useEffect(() => {
    let countdownTimer;

    if (countdown > 0) {
      countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(countdownTimer);
      fetchScanAndPreview();
    }

    return () => clearInterval(countdownTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const fetchScanAndPreview = async () => {
    setError('');
    setResult(null);
    setPreview(null);

    try {
      const isPhishing = Object.entries(officialDomains).some(([keyword, officialDomain]) => {
  const lowerUrl = scannedUrl.toLowerCase();
  return lowerUrl.includes(keyword) && !lowerUrl.includes(officialDomain);
});

      if (isPhishing) {
        setResult({
          safe: false,
          shortened: scannedUrl.includes('bit.ly') || scannedUrl.includes('tinyurl'),
          threats: {
            phishing: true,
            impersonation: 'This link pretends to be a trusted service.',
            suspiciousDomain: scannedUrl,
            details: 'This URL resembles a known platform but is hosted on an untrusted domain.'
          }
        });
      } else {
        const res = await fetch('http://localhost:4000/api/check-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: scannedUrl }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to scan the URL');
        } else {
          setResult(data);

          if (data.safe) {
            const previewRes = await fetch(`https://api.linkpreview.net/?key=946b86fc02ce6132234be8de84412244&q=${encodeURIComponent(scannedUrl)}`);
            const previewData = await previewRes.json();

            if (previewData?.title || previewData?.image) {
              setPreview(previewData);
            }
          }
        }
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Network error or backend not running');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.scanResultMain}>
        <h1>Scan Result</h1>
        <p className={styles.urlDisplay}><strong>URL Scanned:</strong> {scannedUrl}</p>

        <section className={styles.resultSection}>
          {loading && countdown > 0 && (
            <>
              <p>🔍 Initializing Scan...</p>
              <p>⏳ Please wait: <strong>{countdown}</strong> seconds remaining</p>
            </>
          )}

          {loading && countdown === 0 && !result && !error && (
            <>
              <p>🔄 Analyzing URL...</p>
              <p>Please wait while we complete the scan.</p>
            </>
          )}

          {!loading && error && (
            <p className={styles.unsafe}>⚠️ {error}</p>
          )}

          {!loading && result?.safe && (
            <>
              <p className={styles.safe}>✅ This link is safe!</p>

              {preview ? (
                <div className={styles.previewCard}>
                  {preview.image && (
                    <img
                      src={preview.image}
                      alt="Website Preview"
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '12px',
                        marginBottom: '12px',
                      }}
                    />
                  )}
                  <h3>{preview.title}</h3>
                  <p>{preview.description}</p>
                </div>
              ) : (
                <p>Loading preview...</p>
              )}

              <a
                href={scannedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.visitLink}
              >
                Visit Site
              </a>
            </>
          )}

          {!loading && result && !result.safe && (
            <>
              <p className={styles.unsafe}>⚠️ Warning! This link is unsafe or suspicious.</p>

              {result.shortened && (
                <p style={{ color: 'orange' }}>
                  ⚠️ This URL is a shortened link. Please be careful.
                </p>
              )}

              {result.threats && (
                <pre style={{
                  background: '#ffe5e5',
                  padding: '10px',
                  borderRadius: '8px',
                  color: '#b30000',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {JSON.stringify(result.threats, null, 2)}
                </pre>
              )}

              <a
                href={scannedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ pointerEvents: 'none', opacity: 0.5 }}
              >
                Visit Site (Disabled for safety)
              </a>
            </>
          )}

          {!loading && (
            <button onClick={handleGoBack} className={styles.backButton}>
              Go Back
            </button>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ScanResult;
