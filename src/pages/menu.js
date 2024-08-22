import './style.css';
import {Link} from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase";
import {signInWithPopup, signOut} from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function Menu() {

const navigate = useNavigate();
const [userEmail, setUserEmail] = useState(null);

const signInWithGoogle = async () => {
    try {
    await signInWithPopup(auth, googleProvider);
    // Redirect to a new page after successful login
    navigate('/forum'); // Change '/dashboard' to the desired route
    } catch (err) {
        console.error(err); 
}
}

const logout = async () => {
    try {
    await signOut(auth);
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
        <Link to="/" button className="logo">RatemyUni</Link>
        </div>   
        <button className="sign-up-btn" onClick={signInWithGoogle}>Sign up</button>
                <button className="log-out-btn" onClick={logout} id="submitBtn">Logout</button>
        
        <div>
            {userEmail ? (
                <p>Welcome, {userEmail}</p>
            ) : (
                <p></p>
            )}
        </div>
    </div>        
    )
    
}
export default Menu;