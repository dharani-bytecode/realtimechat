import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatRoomPage from './pages/ChatRoomPage';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatRoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;
