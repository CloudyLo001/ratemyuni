import "./homemenu.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { auth, googleProvider, db } from "../config/firebase";
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
import UserInfo from "./userinfo";

function HomeMenu() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [user, setUser] = useState(null);
  const db = getFirestore();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  async function checkUserExists(userEmail) {
    const currUser = auth.currentUser;
    const uemail = currUser.email;

    const userDoc = collection(db, "UserInfo"); // Replace "UserInfo" with your collection name
    const q = query(userDoc, where("UserEmail", "==", uemail));
    const querySnapshot = await getDocs(q);
    //const docSnapshot = await getDoc(userDoc);
    if (!querySnapshot.empty) {
      console.log("User exists:");
      return true; // User has been logged before
    } else {
      console.log("User does not exist");
      return false; // User is new
    }
  }
  const handleButtonClick = () => {
    navigate("/login");
  };
  const signInWithGoogle = async () => {
    // Check if user info exists in Firestore
    const userInfoCollection = collection(db, "UserInfo");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user.email;

      const check = await checkUserExists(user);

      if (check) {
        navigate("/forum");
        console.log("hi");
        console.log(user);
      } else {
        navigate("/userinfo");
        console.log("bni");
        console.log(user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div className="container_header">
        <Link to="/" button className="logo">
          RatemyUni
        </Link>
      </div>
      {
        <button className="log-out-btn" onClick={logout} id="submitBtn">
          Logout
        </button>
      }

      {/*<button className="sign-up-btn" onClick={signInWithGoogle}>
        Leave a Review
      </button>*/}
      <div>{userEmail ? <p>Welcome, {userEmail}</p> : <p></p>}</div>
    </div>
  );
}
export default HomeMenu;
