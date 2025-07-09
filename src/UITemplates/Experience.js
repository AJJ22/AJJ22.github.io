import React from "react";

import NavBar from './NavBar.js';

function experience(){
    return(
        <div>
            <NavBar />
            <div class="page">
                <h1>Experience</h1>
                <ul>
                    <strong>Product Developer | Epicor Software | January 2020 – Present</strong>
                    <ul>
                        <strong>ERP Kinetic Development - October 2022 - Present</strong>
                        <li>Developed new features and solutions for the existing product implementation.</li>
                        <li>Resolved bugs with backend C# logic including MSSQL Server queries and frontend bugs in Angular to help ensure a seamless user experience.</li>
                        <li>Collaborated with and coached other developers and product owners to fulfill product specifications and code standards.</li>
                        <li>Spearheaded a Test-Driven Development company-wide initiative, with a 90% code coverage goal using MSTest.</li>
                        <li>Participated in sprint planning sessions and daily standup meetings.</li>
                    </ul>
                    <br></br>
                    <ul>
                        <strong>ERP/CPQ Product Development and Integration - January 2022 - October 2022</strong>
                        <li>Integrated the newly acquired CPQ configurator platform into the core ERP application giving users the ability to design their own parts.</li>
                        <li>Implemented new features on the CPQ configurator and CPQ SNAP engine, providing ongoing bug resolution/product support utilizing a .NET/Angular tech stack.</li>
                    </ul>
                    <br></br>
                    <ul>
                        <strong>ERP Kinetic Legacy Conversion - January 2021 - January 2022</strong>
                        <li>Refactored legacy C# standalone desktop application into modern .NET/Angular web application with a newly designed UI/UX that utilizes proprietary component library, Kinetic Core.</li>
                        <li>Designed and implemented multiple new front end layouts utilizing tools such as MetaDev and Application Studio.</li>
                    </ul>
                    <br></br>
                    <ul>
                        <strong>ERP Classic - January 2020 - January 2021</strong>
                        <li>Implemented new features and resolved bugs for the ERP Classic software suite utilizing a .NET/Angular tech stack.</li>
                        <li>Utilized common code standards to develop and maintain the large-scale ERP application.</li>
                    </ul>
                </ul>
                <ul>
                    <strong>Software Developer | RSM US LLP | October 2019 - December 2019</strong>
                    <li>Wrote JavaScript code to add advanced functionality to audit forms that would not have been possible in CaseWare alone. <br />This functionality gave auditors a more intuitive user experience allowing them to complete their jobs quicker and more accurately.</li>
                    <li>Developed audit forms for international use using CaseWare IDEA. This suite of forms was the basis for the entire RSM auditing department. Used by auditors in every indsustry, across the globe.</li>
                    <li>Worked in an Agile development environment. Participated in standups, sprint planning sessions and sprint retrospectives to increase team adaptability and efficiency.</li>
                </ul>
                <ul>
                    <strong>2018 - QE & Automation Testing Intern | Royal Bank of Canada | Minneapolis, MN</strong>
                    <li>Wrote automated tests to compare testing platforms Perfecto and SeeTest</li>
                    <li>Wrote performance tests using Java and Selenium to record user experience times</li>
                    <li>Became proficient at writing code in a professional development environment</li>
                    <li>Received recognition from my supervisor for my achievements</li>
                </ul>
                <ul>
                    <strong>2017 - Application Development Intern | Nationwide Insurance | Des Moines, IA</strong>
                    <li>Used Microsoft Access & Visual Basic to create new UI and write SQL queries</li>
                    <li>Translated Junit tests into Spock to assist development of Groovy/Grails applications</li>
                    <li>Developed expertise in Agile Methodologies during the course of my projects</li>
                </ul>
            </div>
        </div>
    )
}

export default experience;