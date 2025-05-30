import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import ScanResult from './pages/ScanResult'; // Create this component next

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan-result" element={<ScanResult />} />
      </Routes>
    </Router>
  );
}

export default App;
