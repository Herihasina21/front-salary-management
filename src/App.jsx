import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; // Importez ToastContainer

import Bonus from './pages/Bonus';
import Dashboard from './pages/Dashboard';
import Deduction from './pages/Deduction';
import Department from './pages/Department';
import Employee from './pages/Employee';
import Payroll from './pages/Payroll';
import Salary from './pages/Salary';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PreLoader from './components/Preloader';
import Footer from './components/Footer';

function LayoutWrapper() {
  const location = useLocation();

  useEffect(() => {
    // Préloader
    setTimeout(() => {
      const loader = document.querySelector('.loader-bg');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }
    }, 1000);

    // Charger les scripts externes (Bootstrap et Feather)
    const loadScripts = async () => {
      await new Promise(resolve => {
        const checkBootstrap = () => {
          if (window.bootstrap) return resolve();
          setTimeout(checkBootstrap, 100);
        };
        checkBootstrap();
      });

      if (window.feather) window.feather.replace();
    };

    loadScripts();
  }, [location]);

  return (
    <div className="content">
      <PreLoader />
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employes" element={<Employee />} />
        <Route path="/department" element={<Department />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/bonus" element={<Bonus />} />
        <Route path="/deduction" element={<Deduction />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;