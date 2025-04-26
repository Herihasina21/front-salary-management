import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Employee from './pages/Employee';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="g-sidenav-show bg-gray-100">
        <Sidebar />
        <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
          <Navbar />
          <div className="container-fluid py-4">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employes" element={<Employee />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
