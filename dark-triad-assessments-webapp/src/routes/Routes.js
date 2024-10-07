import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home/Home';
import SDT3 from '../components/Assessments/SDT3';
import SDT4 from '../components/Assessments/SDT4';
import MACHIV from '../components/Assessments/MACHIV';
import SECS from '../components/assessments/SECS/SECS';
import Visualization from '../components/Visualization/Visualization';
import About from '../components/about/About';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/assessment/sdt3" element={<SDT3 />} />
      <Route path="/assessment/sdt4" element={<SDT4 />} />
      <Route path="/assessment/machiv" element={<MACHIV />} />
      <Route path="/assessment/secs" element={<SECS />} />
      <Route path="/results" element={<Visualization />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default AppRoutes;