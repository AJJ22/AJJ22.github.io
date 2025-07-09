import React from "react";

import NavBar from './NavBar.js';

function education(){
    return(
        <div>
            <NavBar />
            <div class="page">
                <h1>Education</h1>
                <p>
                    <strong>BS - Computer Science</strong>
                    <div>Buena Vista University - Storm Lake, Iowa</div>
                    <div>Graduated, May 2019 - GPA 3.12</div>
                </p>
                <p>
                    <strong>High School Diploma</strong>
                    <div>Eden Prairie High School</div>
                    <div>Graduated 2015</div>
                </p>
            </div>
        </div>
    );
}

export default education;