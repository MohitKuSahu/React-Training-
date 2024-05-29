import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Login&SignUp/LoginPage';
import ShipmentDetails from './Components/ShipmentDetails';
import ShipmentDetailing from "./Components/ServerSideShipping";
import NavigationBar from './Navbar/Navbar';
import SignUpPage from './Login&SignUp/SignUp';
import ShipmentMap from './Components/ShipmentMap';
import GridView from './Components/GridView';
import { Box } from '@mui/material';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <NavigationBar/>
      <Box marginTop="64px"> 
        <NavigationBar setIsAuthenticated={setIsAuthenticated}/>
      </Box>
      <Routes>
        <Route path="/LoginPage" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/ShipmentDetails" element={<ShipmentDetails isAuthenticated={isAuthenticated} />} />
        <Route path="/ServerSideShipping" element={<ShipmentDetailing />} />
        <Route path="/GridView" element={<GridView isAuthenticated={isAuthenticated} />} />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/ShipmentMap"element={<ShipmentMap isAuthenticated={isAuthenticated}/>} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/ShipmentDetails" /> : <Navigate to="/LoginPage" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;






