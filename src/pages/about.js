import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import "./about.css";
import HomeMenu from "./homemenu";
import Footer from "./footer";

function About() {
  return (
    <body>
      <HomeMenu />
      <div className="about-container">
        <h2>About University Reviews</h2>

        <main>
          <section className="about-content">
            <h2>Our Mission</h2>
            <p>
              At RatemyUni, we aim to create a platform where students, alumni,
              and prospective students can gain genuine insights about
              universities from real student experiences.
            </p>
            <h2>Why We Started</h2>
            <p>
              Choosing the right university is one of the most important
              decisions in a person’s life. We’re creating this platform to make
              that choice easier by providing transparent, reliable, and
              personal reviews about universities worldwide.
            </p>
            <p>
              Our goal is to empower students with information, helping them
              make well-informed decisions on their University search based on
              what truly matters to them – whether it’s the academic
              environment, campus facilities, faculty, or social life.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </body>
  );
}

export default About;
