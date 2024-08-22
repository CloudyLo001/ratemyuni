import React, { useEffect } from "react";
import './footer.css';
import './style.css';
import './login.css';
import Menu from "./menu";
import Footer from "./footer"
import {Link} from 'react-router-dom';
import { auth, googleProvider } from "../config/firebase";
import {signInWithPopup, signOut} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {

    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
        await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err); 
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
         
        const container = document.getElementById('container');
        const formTitle = document.getElementById('formTitle');
        const submitBtn = document.getElementById('submitBtn');
        const toggleForm = document.getElementById('toggleForm');
        const errorMessage = document.getElementById('errorMessage');
        const passwordGroup = document.getElementById('passwordGroup');
        const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
    
        let isLogin = true;
    
        toggleForm.addEventListener('click', () => {
            isLogin = !isLogin;
            if (isLogin) {
                formTitle.innerText = 'Login';
                submitBtn.innerText = 'Login';
                toggleForm.innerText = "Don't have an account? Sign Up";
                confirmPasswordGroup.style.display = 'none';
            } else {
                formTitle.innerText = 'Sign Up';
                submitBtn.innerText = 'Sign Up';
                toggleForm.innerText = 'Already have an account? Login';
                confirmPasswordGroup.style.display = 'block';
            }
            errorMessage.innerText = '';
            emailInput.value = '';
            passwordInput.value = '';
            confirmPasswordInput.value = '';
        });
    
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();
    
            if (!email || !password) {
                errorMessage.innerText = 'Please fill out all fields.';
                return;
            }
    
            if (!isLogin && password !== confirmPassword) {
                errorMessage.innerText = 'Passwords do not match.';
                return;
            }
    
            if (isLogin) {
                // Mock login verification
                if (email === 'user@example.com' && password === 'password') {
                    alert('Login successful!');
                    errorMessage.innerText = '';
                } else {
                    errorMessage.innerText = 'Invalid email or password.';
                }
            } else {
                // Mock signup process
                alert('Sign up successful!');
                errorMessage.innerText = '';
                toggleForm.click(); // Switch to login after signup
            }
        });
        }, []);
  return (
    <div>
        <div>
            <Menu />
        <div className="search-container">
            <input id="search" className="search-box" placeholder="Enter your University . . " name=""/>
                <div className="suggestions" id="suggestions"></div>
        </div>
        
        <div className="container" id="container">
            <div className="form-header">
                <h2 id="formTitle">Login</h2>
            </div>
            <div className="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required/>
            </div>
            <div className="form-group" id="passwordGroup">
                <label for="password">Password</label>
                <input type="password" id="password" required/>
            </div>
            <div className="confirm-form-group" id="confirmPasswordGroup">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword"/>
            </div>
            <div className="error-message" id="errorMessage"></div>
            <div className="form-group">
                <button id="submitBtn">Login</button>
                <button onClick={signInWithGoogle} id="submitBtn">Sign in with Google</button>
                <button onClick={logout} id="submitBtn">Logout</button>
            </div>
            <div className="toggle-link">
                <a id="toggleForm">Don't have an account? Sign Up</a>
            </div>

        </div>
            </div>
            <Footer />
    </div>

    
  )
};

export default Login;