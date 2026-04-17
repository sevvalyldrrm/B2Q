import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Quantum from './pages/Quantum';
import Agents from './pages/Agents';
import Vault from './pages/Vault';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } />
        <Route path="/quantum" element={
          <MainLayout>
            <Quantum />
          </MainLayout>
        } />
        <Route path="/agents" element={
          <MainLayout>
            <Agents />
          </MainLayout>
        } />
        <Route path="/vault" element={
          <MainLayout>
            <Vault />
          </MainLayout>
        } />
        <Route path="/settings" element={
          <MainLayout>
            <Settings />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
