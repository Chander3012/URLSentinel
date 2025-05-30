import React from 'react';
import styles from './style.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h3>URLSentinel 🔐</h3>
          <p>Your trusted link safety companion. Analyze suspicious links before you click.</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Connect</h4>
          <ul>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">GitHub</a></li>
            <li><a href="#">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} URLSentinel. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
