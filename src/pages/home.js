import React, { useState, useEffect } from "react";
import "./footer.css";
import "./home.css";
import HomeMenu from "./homemenu";
import Footer from "./footer";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      const querySnapshot = await getDocs(collection(db, "Universities")); // Ensure collection name matches Firestore
      const universityList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUniversities(universityList);
    };

    fetchUniversities();
  }, []);

  {
    /*const universityRoutes = {
    "University of Waterloo": "/forum",
    "University of Toronto": "/university-of-toronto",
    "University of British Columbia": "/university-of-british-columbia",
  };*/
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    if (e.target.value.length > 0) {
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  const filterUniversities = universities.filter((university) =>
    university.University?.toLowerCase().includes(searchTerm)
  );

  const handleSelect = (university) => {
    setSearchTerm(university.University); // Set the input to the selected university
    setDropdownVisible(false); // Close the dropdown
    navigate(`/forum/${university.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const selectedUniversity = universities.find(
        (university) =>
          university.University.toLowerCase() === searchTerm.toLowerCase()
      );
      if (selectedUniversity) {
        handleSelect(selectedUniversity);
      }
    }
  };

  return (
    <body>
      <HomeMenu />
      <div className="header">
        <h1>Real Students Real Reviews</h1>
        <p>A Resource for Your University Search</p>
      </div>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown} // Add the onKeyDown handler
          placeholder="Search for University..."
          onFocus={() => setDropdownVisible(searchTerm.length > 0)} // Show dropdown when focused
        />
        {dropdownVisible && (
          <ul className="dropdown-menu">
            {filterUniversities.length > 0 ? (
              filterUniversities.map((university, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(university)}
                  className="dropdown-item"
                >
                  {university.University}
                </li>
              ))
            ) : (
              <li className="no-results">No results found</li>
            )}
          </ul>
        )}
      </div>
      <Footer />
    </body>
  );
}

export default HomePage;
