import React, { useState } from 'react';  // import useState for managing input
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './style.module.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // <-- added

  // URL validation function
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    // eslint-disable-next-line no-unused-vars
    } catch (_) {
      return false;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidUrl(inputUrl)) {
      setError('Please enter a valid URL.');
      return;
    }
    setError('');
    // Navigate to /scan-result page and pass URL via state
    navigate('/scan-result', { state: { url: inputUrl } });
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>🔐 URLSentinel</h1>
          <p className={styles.tagline}>Securely scan any URL in real-time for threats and phishing risks.</p>

          <div className={styles.features}>
            <div className={styles.featureItem}>⚡ Fast & Reliable</div>
            <div className={styles.featureItem}>🔍 Deep Threat Analysis</div>
            <div className={styles.featureItem}>🆓 Free & Easy to Use</div>
          </div>
          <a href="#how-it-works" className={styles.secondaryBtn}>How it Works</a>

          <form className={styles.linkForm} onSubmit={handleSubmit}>
            <input
              type="url"
              placeholder="Enter a URL to scan"
              className={styles.linkInput}
              required
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
            <button type="submit" className={styles.submitBtn}>Scan Now</button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}

          <p className={styles.userCount}>Join 50,000+ users who trust URLSentinel</p>
        </div>
      </header>

      <section id="about" className={styles.aboutSection}>
  <div className={styles.aboutContent}>
    <h2>About URLSentinel</h2>
    <p>
      URLSentinel is a cutting-edge cybersecurity platform dedicated to protecting users from malicious online threats.
      Our mission is to empower individuals and organizations by providing a robust, real-time URL scanning solution that
      identifies phishing attempts, malware, and scam links before they cause harm.
    </p>
    <p>
      Leveraging advanced threat intelligence, machine learning algorithms, and integration with multiple security databases,
      URLSentinel offers comprehensive risk analysis with unmatched speed and accuracy. Whether you are a casual internet user,
      a cybersecurity professional, or a business seeking to safeguard your digital assets, our tool is designed to be intuitive,
      reliable, and accessible.
    </p>
    <p>
      At URLSentinel, we believe online safety is a fundamental right. That’s why we continuously update our detection mechanisms
      to stay ahead of emerging threats and ensure you navigate the web with confidence.
    </p>
  </div>
</section>


      <section id="services" className={styles.sectionAlt}>
        <h2>Our Services</h2>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3>🔍 URL Scanner</h3>
            <p>Quickly check if any link contains malware, phishing, or scam elements.</p>
          </div>
          <div className={styles.card}>
            <h3>🛡️ Real-time Protection</h3>
            <p>Built on real-time threat intelligence to give instant feedback on URL safety.</p>
          </div>
          <div className={styles.card}>
            <h3>📊 Report Analytics</h3>
            <p>Get insight into scanned links, their source, and threat levels.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className={styles.howItWorksSection}>
  <h2>How It Works</h2>
  <div className={styles.stepsContainer}>
    <div className={styles.step}>
      <span className={styles.stepNumber}>1</span>
      <p>Paste your suspicious URL into our scanner input.</p>
    </div>
    <div className={styles.step}>
      <span className={styles.stepNumber}>2</span>
      <p>Our advanced engine analyzes the URL using multiple threat databases and AI algorithms.</p>
    </div>
    <div className={styles.step}>
      <span className={styles.stepNumber}>3</span>
      <p>Receive a detailed report classifying the risk level and highlighting any detected threats.</p>
    </div>
  </div>
</section>


<section id="faq" className={styles.faqSection}>
  <h2>Frequently Asked Questions</h2>
  <div className={styles.faqContainer}>
    <details className={styles.faqItem}>
      <summary>Is URLSentinel free to use?</summary>
      <p>Yes, our basic URL scanning services are completely free with no registration required.</p>
    </details>

    <details className={styles.faqItem}>
      <summary>How fast is the scanning process?</summary>
      <p>Our scanning engine typically provides results within seconds using real-time threat intelligence.</p>
    </details>

    <details className={styles.faqItem}>
      <summary>Can URLSentinel detect phishing sites?</summary>
      <p>Absolutely. We use multiple databases and machine learning to identify phishing attempts reliably.</p>
    </details>

    <details className={styles.faqItem}>
      <summary>Is my privacy protected?</summary>
      <p>Yes, we never store URLs you scan and maintain strict privacy standards to protect your data.</p>
    </details>
  </div>
</section>


      <section id="contact" className={styles.contactSection}>
  <h2>Contact Us</h2>
  <p>If you have any questions or want to get in touch, please fill out the form below. We’d love to hear from you!</p>
  <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
    <label htmlFor="name">Name</label>
    <input type="text" id="name" name="name" placeholder="Your full name" required />

    <label htmlFor="email">Email</label>
    <input type="email" id="email" name="email" placeholder="your.email@example.com" required />

    <label htmlFor="message">Message</label>
    <textarea id="message" name="message" placeholder="Write your message here..." rows="5" required></textarea>

    <button type="submit">Send Message</button>
  </form>
</section>


      <Footer />
    </div>
  );
};

export default LandingPage;
