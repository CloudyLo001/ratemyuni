import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { auth, googleProvider, db } from "../../config/firebase";
import {
  signInWithPopup,
  signOut,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  getFirestore,
} from "firebase/firestore";
import UserInfo from "../userinfo";
import HomeMenu from "../homemenu";
import Footer from "../footer";
import "../style.css";
import "./questionaire.css";

function Questionaire() {
  useEffect(() => {}, []);
  const [answer, setAnswer] = useState("");

  // Handler for the textbox input
  const handleInputChange = (e) => {
    setAnswer(e.target.value);
  };

  // Handler for the submit button
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You submitted: ${answer}`);
    // You can add logic here to handle the answer, e.g., send to a backend
    setAnswer(""); // Clear the input after submission
  };
  return (
    <div>
      <HomeMenu />
      {/* Question Header */}
      <div className="question-container">
        <h1>Tell us about your University Experience</h1>

        <form onSubmit={handleSubmit}>
          {/* Textbox for the answer */}
          <input
            type="text"
            className="answer-box"
            value={answer}
            onChange={handleInputChange}
            placeholder="Type your answer here..."
          />

          {/* Submit Button */}
          <button type="submit">Submit</button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
export default Questionaire;
