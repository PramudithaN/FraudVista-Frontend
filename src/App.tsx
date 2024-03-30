import React from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from './Login';

function App() {
  return (<>
     
 <Router>
          <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/*" element={<Navbar />} />
      </Routes>
        </Router>
    </>
  );
}

export default App;
