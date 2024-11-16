import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './components/Home';
import Admin from './components/Admin';
import Login from './components/Login';

function App() {
  const { currentuser, loading } = useSelector(state => state.ass_user);

  return (
    <div className='flex h-screen justify-center '>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={currentuser ? <Admin/> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
