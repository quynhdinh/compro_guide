import React from 'react';
import './App.css';
import Courses from './Courses';
import Home from './Home';
import Blog from './Blog';
import Chatbot from './Chatbot';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
// create a new file src/Index.js with the following content:

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="topbar">
          <NavLink to="/" className="brand">Compro Guide</NavLink>
          <nav className="nav">
            <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/courses">Courses</NavLink>
            <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/blog">Blog</NavLink>
          </nav>
        </div>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
