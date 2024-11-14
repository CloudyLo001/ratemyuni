import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import "./about.css";
import HomeMenu from "./homemenu";
import Footer from "./footer";

function PrivacyPolicy() {
  return (
    <div>
      <HomeMenu />
      <body>
        <div className="about-container">
          <h2>Privacy Policy</h2>

          <main>
            <section className="about-content">
              <p>
                At [Your Website Name], we value your privacy. This Privacy
                Policy outlines how we collect, use, and protect your personal
                information when you visit our website. ### Information We
                Collect We collect personal information such as your name, email
                address, and contact details when you interact with our website.
                We may also collect non-personal information, such as IP
                addresses and browsing patterns. ### How We Use Your Information
                We use the information we collect to improve your experience on
                our website, respond to your inquiries, and send you updates or
                promotional content you’ve requested. ### How We Protect Your
                Information We implement security measures to safeguard your
                data, including encryption and secure servers. ### Sharing Your
                Information We do not sell or rent your personal information to
                third parties. However, we may share your data with trusted
                service providers who help us operate our website. ### Cookies
                Our website uses cookies to enhance your user experience. You
                can control cookie settings through your browser. ### Your
                Rights You have the right to access, update, or delete your
                personal information. You can also opt-out of communications
                from us at any time. ### Data Retention We will retain your
                personal information as long as necessary to fulfill the
                purposes outlined in this policy. ### Children’s Privacy Our
                website is not intended for children under 13. We do not
                knowingly collect personal data from children. ### Changes to
                This Policy We may update this policy from time to time. Any
                changes will be posted on this page with the effective date. ###
                Contact Us If you have any questions, please contact us at
                [Insert Contact Email]. Thank you for trusting [Your Website
                Name] with your personal information.
              </p>
            </section>
          </main>
        </div>
      </body>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
