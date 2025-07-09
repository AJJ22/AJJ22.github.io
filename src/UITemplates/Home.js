import {React, Image, SafeAreaView, SafeAreaProvider} from 'react';
import portrait from './../images/three.jpg';

import NavBar from './NavBar.js';

function home(){
    return (
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"></link>
            <div>
                <NavBar />
            </div>
            
            <div class="page">
                <p>
                    <img class="portrait" src={portrait} />
                    <span class="name">Austin Jerich</span>
                </p>
                
                <p class="p1">
                    <h4>About Me</h4>
                    <p>
                        I am a software engineering professional actively searching for new employment opportunities. 
                    </p>
                    <p>
                        I received my BS in computer science in 2019. Since then, the majority of my professional experience has come from my employment 
                        with <a href="https://www.epicor.com/en-us/">Epicor Software</a>. I am leaving Epicor because I would like to gain professional experience 
                        outside of ERP development.
                    </p>
                    <p>
                        Epicor is an ERP (Enterprise Resource Planning) software company. One of our flagship products (the one I contribute to) is Epicor Kinetic. 
                        Kinetic is a SaaS cloud application that assists manufacturers in efficiently running their businesses.
                    </p>
                    <p>
                        I started this project as skill building exercise to help me learn React, but also to use as something to demonstrate my web application development 
                        knowledge. I plan to continue working on the site by embedding some of my previous side projects that I have done over the years.
                    </p>
                </p>
            </div>
        </div>
    );
}

export default home;