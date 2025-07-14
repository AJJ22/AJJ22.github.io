import './App.css';
import Education from './UITemplates/Education';
import Experience from './UITemplates/Experience';
import Home from './UITemplates/Home';
import Contact from './UITemplates/Contact';
import TextGame2019 from './UITemplates/TextGame2019';
//import NavBar from './UITemplates/NavBar.js';

import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App(){
  return(
    <>
    {/* This is the alias of BrowserRouter i.e. Router */}
    <Router>
        <Routes>
            {}
            <Route exact path="/" element={<Home />} />

            {}
            <Route path="/experience" element={<Experience />} />

            {}
            <Route path="/education" element={<Education />} />

            {}
            <Route path="/contact" element={<Contact />} />

            {}
            <Route path="/textGame2019" element={<TextGame2019 />} />

            {/* If any route mismatches the upper route endpoints then, redirect triggers and redirects app to home component with to="/" */}
            {/* <Redirect to="/" /> */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </Router>
</>
  );
}

export default App;
