import {React, Image, SafeAreaView, SafeAreaProvider} from 'react';

import NavBar from './NavBar.js';
var __html = require('./TextGame2019.html');
var template = { __html: __html };
//var perf =require('./TextGame2019.html');
//import "./TextGame2019.html";

// function textGame2019() {
//     return(
//         <div>
//             <div>
//                 <NavBar />
//             </div>
//             <div class="page">
//                 <iframe src="./TextGame2019.html"></iframe>
//             </div>
//         </div>
//     );
// }
// export default textGame2019;



function iframe() {
    return {
        __html: '<iframe src="./TextGame2019.html" width="1000" height="1000"></iframe>'
    }
}


export default function Exercises() {
    return (
        <div>
            <div dangerouslySetInnerHTML={iframe()} />
        </div>)
}