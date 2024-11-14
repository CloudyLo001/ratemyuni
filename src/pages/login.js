import React, { useEffect } from "react";
import "./footer.css";
import "./style.css";
import "./login.css";
import Menu from "./homemenu";
import Footer from "./footer";
import { Link } from "react-router-dom";
import { auth, googleProvider, db } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";

function LoginButton() {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Check if user is a first-time user
      const userRef = doc(db, "Users", result.user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // If the user doesn't exist in Firestore, navigate to the userinfo page
        await setDoc(userRef, {
          email: result.user.email,
          name: result.user.displayName,
          // Other fields as required
        });
        navigate("/userinfo");
      } else {
        // If the user exists, navigate to the forum or main page
        navigate("/questions");
      }
    } catch (err) {
      console.error("Error signing in with Google:", err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const container = document.getElementById("container");
    const formTitle = document.getElementById("formTitle");
    const submitBtn = document.getElementById("submitBtn");
    const toggleForm = document.getElementById("toggleForm");
    const errorMessage = document.getElementById("errorMessage");
    const passwordGroup = document.getElementById("passwordGroup");
    const confirmPasswordGroup = document.getElementById(
      "confirmPasswordGroup"
    );
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    let isLogin = true;

    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();

      if (!email || !password) {
        errorMessage.innerText = "Please fill out all fields.";
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        errorMessage.innerText = "Passwords do not match.";
        return;
      }

      if (isLogin) {
        // Mock login verification
        if (email === "user@example.com" && password === "password") {
          alert("Login successful!");
          errorMessage.innerText = "";
        } else {
          errorMessage.innerText = "Invalid email or password.";
        }
      } else {
        // Mock signup process
        alert("Sign up successful!");
        errorMessage.innerText = "";
        toggleForm.click(); // Switch to login after signup
      }
    });
  }, []);
  return (
    <div>
      <body>
        <Menu />
        <div className="container" id="container">
          <div className="form-header">
            <h2 id="formTitle">Login</h2>
          </div>
          {/*}
          <div className="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div className="form-group" id="passwordGroup">
            <label for="password">Password</label>
            <input type="password" id="password" required />
          </div>*/}
          <div className="confirm-form-group" id="confirmPasswordGroup">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" />
          </div>
          <div className="error-message" id="errorMessage"></div>
          <div className="form-group">
            <button onClick={signInWithGoogle} id="googleBtn">
              Sign in with Google
            </button>
            {/*<button onClick={logout} id="submitBtn">
              Logout
            </button>*/}
          </div>
        </div>
      </body>
      <Footer />
    </div>
  );
}

export default LoginButton;
