import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Privacy Policy</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
