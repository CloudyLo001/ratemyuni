import "./style.css";
import "./userinfo.css";
import React, { useState, useEffect } from "react";
import Footer from "./footer";
import HomeMenu from "./homemenu";
import { db, auth } from "../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

function UserInfo() {
  const [formData, setFormData] = useState({
    Program: "",
    LevelOfEducation: "",
    ExpectedGraduationYear: "",
    Rating: "",
    UserEmail: "",
  });
  const userInfoCollection = collection(db, "UserInfo");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend or Firebase
    e.preventDefault();
    try {
      // Add the document to Firestore
      const docRef = await addDoc(userInfoCollection, {
        ...formData,
        UserEmail: auth.currentUser.email,
        userId: auth.currentUser.uid, // Assuming the user is authenticated
      });
      console.log("Document written with ID: ", docRef.id);

      // Clear the form after successful submission
      setFormData({
        Program: "",
        LevelOfEducation: "",
        ExpectedGraduationYear: "",
        Rating: "",
        UserEmail: "",
      });

      // Redirect to a different page
      navigate("/forum");
    } catch (error) {
      console.error("Error adding document: ", error);
      // You can show an error message to the user here
      alert("An error occurred while submitting the information.");
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "UserInfo", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setFormData(userDoc.data());
        }
      }
      setIsLoading(false);
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      <HomeMenu />
      <div className="container" id="container">
        <div>User Information</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Program">Your Program</label>
            <input
              type="text"
              name="Program"
              id="Program"
              value={formData.Program}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Level Of Education">Level of Education</label>
            <select
              id="LevelOfEducation"
              name="LevelOfEducation"
              value={formData.LevelOfEducation}
              onChange={handleChange}
              required
            >
              <option value="">Select Level</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Master's">Master's</option>
              <option value="Phd">Phd</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ExpectedGraduationYear">
              Expected Graduation Year:
            </label>
            <input
              type="number"
              id="ExpectedGraduationYear"
              name="ExpectedGraduationYear"
              value={formData.ExpectedGraduationYear}
              onChange={handleChange}
              min="1950"
              max="2030"
              required
            />
          </div>
          <div className="form-group">
            <header>How was your experience?</header>
            <select
              id="Rating"
              name="Rating"
              value={formData.Rating}
              onChange={handleChange}
              required
            >
              <option value="">Select Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">
            {isLoading ? "Submitting..." : "Submit"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
}
export default UserInfo;
