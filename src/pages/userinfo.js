import React, { useState, useEffect } from "react";
import Footer from "./footer";
import HomeMenu from "./homemenu";
import { db, auth } from "../config/firebase";
import "./style.css";
import "./userinfo.css";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc,
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
  const [suggestions, setSuggestions] = useState([]);
  const [universities, setUniversities] = useState([]);

  const programs = [
    "Accounting",
    "Actuarial Science",
    "African Studies",
    "Agricultural Science",
    "Allied Health",
    "Anthropology",
    "Archaeology",
    "Architecture",
    "Art History",
    "Astronomy",
    "Biochemistry",
    "Biological Sciences",
    "Biology",
    "Biomedical Engineering",
    "Business Administration",
    "Business Analytics",
    "Business Economics",
    "Business Management",
    "Chemical Engineering",
    "Chemistry",
    "Civil Engineering",
    "Cognitive Science",
    "Communications",
    "Computer Engineering",
    "Computing and Financial Management",
    "Computer Science",
    "Construction Management",
    "Creative Writing",
    "Criminal Justice",
    "Criminology",
    "Cultural Studies",
    "Cybersecurity",
    "Data Analytics",
    "Data Science",
    "Dentistry",
    "Economics",
    "Education",
    "Electrical Engineering",
    "Electronics Engineering",
    "Emergency Management",
    "Environmental Engineering",
    "Environmental Science",
    "Fashion Design",
    "Film Studies",
    "Finance",
    "Forensic Science",
    "Gender Studies",
    "Geography",
    "Geology",
    "Graphic Design",
    "Health Administration",
    "Health Sciences",
    "History",
    "Hospitality Management",
    "Human Resources Management",
    "Human Services",
    "Information Science",
    "Information Technology",
    "International Business",
    "International Relations",
    "Journalism",
    "Kinesiology",
    "Law",
    "Library Science",
    "Linguistics",
    "Manufacturing Engineering",
    "Marketing",
    "Mathematics",
    "Management Engineering",
    "Mechanical Engineering",
    "Mechatronics Engineering",
    "Media Studies",
    "Microbiology",
    "Music",
    "Nursing",
    "Nutrition",
    "Occupational Therapy",
    "Pharmacy",
    "Philosophy",
    "Physics",
    "Political Science",
    "Psychology",
    "Public Administration",
    "Public Health",
    "Religious Studies",
    "Social Work",
    "Sociology",
    "Software Engineering",
    "Speech-Language Pathology",
    "Statistics",
    "Supply Chain Management",
    "Systems Design Engineering",
    "Theatre Arts",
    "Therapeutic Recreation",
    "Tourism Management",
    "Translation Studies",
    "Urban Planning",
    "Veterinary Medicine",
    "Visual Arts",
    "Web Development",
    "Wildlife Management",
    "Women’s Studies",
    "Zoology",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e, redirectPath = "/") => {
    e.preventDefault();

    try {
      const userEmail = auth.currentUser.email;

      if (!userEmail) {
        throw new Error("User is not authenticated.");
      }

      const userDocRef = doc(db, "UserInfo", userEmail);
      await setDoc(userDocRef, {
        ...formData,
        UserEmail: userEmail,
        userId: auth.currentUser.uid,
      });

      setFormData({
        University: "",
        Program: "",
        LevelOfEducation: "",
        ExpectedGraduationYear: "",
        Rating: "",
        UserEmail: "",
      });

      // Navigate back to the previous page
      navigate(-1); // This goes back to the previous page in the history stack
    } catch (error) {
      console.error("Error saving document: ", error);
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
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const universitiesCollection = collection(db, "Universities");
        const universitiesSnapshot = await getDocs(universitiesCollection);
        // Map through documents and get the 'University' field for each doc
        const universitiesList = universitiesSnapshot.docs.map(
          (doc) => doc.data().University
        );
        setUniversities(universitiesList);
      } catch (error) {
        console.error("Error fetching universities: ", error);
      }
    };

    fetchUniversities();
  }, []);
  return (
    <div>
      <HomeMenu />
      <div className="container">
        <h2>User Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="University">Your University</label>
            <select
              name="University"
              id="University"
              value={formData.University}
              onChange={handleChange}
              required
            >
              <option value="">--Please choose a university--</option>
              {universities.map((university, index) => (
                <option key={index} value={university}>
                  {university}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="Program">Your Program</label>
            <select
              name="Program"
              id="Program"
              value={formData.Program}
              onChange={handleChange}
              required
            >
              <option value="">--Please choose a program--</option>
              {programs.map((program, index) => (
                <option key={index} value={program}>
                  {program}
                </option>
              ))}
            </select>
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
            <select
              id="ExpectedGraduationYear"
              name="ExpectedGraduationYear"
              value={formData.ExpectedGraduationYear}
              onChange={handleChange}
              required
            >
              <option value="">Select Year</option>
              {/* Dynamically generate the year options */}
              {Array.from({ length: 81 }, (_, index) => 1960 + index).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>
          {/*<div className="form-group">
            <label htmlFor="Rating">How was your experience?</label>
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
          </div>*/}
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
