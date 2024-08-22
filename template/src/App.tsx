import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppContent from './views/AppContent/AppContent';
import Home from './views/Home/Home';
import Login from './views/Login/Login';
import Register from './views/Register/Register';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/app/*" element={<AppContent />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
