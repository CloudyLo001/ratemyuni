import React, { useState, useEffect } from "react";
import "./footer.css";
import "./style.css";
import HomeMenu from "./homemenu";
import Footer from "./footer";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <body>
      <HomeMenu />

      <div className="best_taital">Real Reviews Real Stories Real Students</div>
      <div className="search-container">
        {/* <input id="search" className="search-box" placeholder="Search for University . . " name=""/> */}
        <div className="suggestions" id="suggestions"></div>
      </div>
      <Link to="/forum" className="discover_bt">
        Look at Reviews
      </Link>

      <Footer />
    </body>
  );
}

export default HomePage;
