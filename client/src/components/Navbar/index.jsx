import React from 'react';
import styles from './style.module.css';

const Navbar = () => {
  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container">
        <a className={`navbar-brand ${styles.brand}`} href="#">🔐 URLSentinel </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className={`navbar-nav ms-auto ${styles.navItems}`}>
            <li className="nav-item"><a className={`nav-link ${styles.navLink}`} href="#">Home</a></li>
            <li className="nav-item"><a className={`nav-link ${styles.navLink}`} href="#about">About</a></li>
            <li className="nav-item"><a className={`nav-link ${styles.navLink}`} href="#services">Services</a></li>
            <li className="nav-item"><a className={`nav-link ${styles.navLink}`} href="#contact">Contact</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
