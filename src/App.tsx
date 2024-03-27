import React from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (<>
  <BrowserRouter>
      <Navbar />
      </BrowserRouter>
    {/* <div className="App">
      HIII
    </div> */}
    </>
  );
}

export default App;
