import React from "react";

import NavBar from './NavBar.js';

function contact(){
    return (
        <div>
            <NavBar />
            <div class="page">
                <h1>Contact</h1>
                <p>
                    <div>Email: austinjrch8@gmail.com</div>
                    <div>Phone: (952)-500-3024</div>
                    <div>Minneapolis, MN</div>
                </p>
                <p>
                    <h3>Other Sites</h3>
                    <a href="https://github.com/AJJ22">GitHub<br/></a>
                    <a href="https://www.linkedin.com/in/austin-jerich-75a120119/">Linkedin</a>
                </p>
            </div>
        </div>
    );
}

export default contact;