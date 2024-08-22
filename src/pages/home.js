import React, { useState, useEffect } from "react";
import './footer.css';
import './style.css';
import Menu from "./menu";
import Footer from "./footer"
import {Link} from 'react-router-dom';

function HomePage() {
  
 

  return (
    <div>
        <Menu />
        
            <div className="best_taital">Your Guide to the Real University Experience</div>
            <div className="search-container">
                <input id="search" className="search-box" placeholder="Search for University . . " name=""/>
                    <div className="suggestions" id="suggestions"></div>
                </div>
                <Link to ="/forum" className="discover_bt">Leave a review</Link>
               
        
      
        <Footer />
    </div>

    
  )
};

export default HomePage;