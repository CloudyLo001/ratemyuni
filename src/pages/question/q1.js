import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
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
  addDoc,
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

function Q1() {
  const [answer, setAnswer] = useState({
    Q1: "",
    UserEmail: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const userInfoCollection = collection(db, "Q1");
  // Reference for the textarea to manually adjust its height
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  // Handler for the textbox input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handler for the submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", setAnswer);
    // You can add logic here to handle the answer, e.g., send to a backend
    try {
      if (!auth.currentUser) {
        throw new Error("User not authenticated");
      }
      const docRef = await addDoc(userInfoCollection, {
        answer,

        UserEmail: auth.currentUser.email,
        userId: auth.currentUser.uid,
      });
      console.log("Document written with ID: ", docRef.id);
      setAnswer(""); // Clear the input after submission
      // Redirect to a different page
      navigate("/q2");
    } catch (error) {
      console.error("Error adding document: ", error);
      // You can show an error message to the user here
      alert("An error occurred while submitting the information.");
    }
  };

  // Adjust the height of the textarea dynamically
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset the height to auto to calculate new height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }
  };

  // Call the adjustTextareaHeight function on every render when the answer changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [answer]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "Questionaire", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setAnswer(userDoc.data());
        }
      }
      setIsLoading(false);
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      <HomeMenu />
      {/* Question Header */}
      <div className="qa-form">
        <div>
          What advice would you give to an incoming first year? Tips & Tricks to
          navigate university.
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            id="answer"
            ref={textareaRef}
            rows={1} // Default row height
            value={answer.Q1}
            onChange={(e) => setAnswer(e.target.value)}
            required
            style={{ resize: "none", overflow: "hidden" }} // Prevent manual resizing
          />

          {/* Submit Button */}
          <button type="submit">Submit</button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
export default Q1;
