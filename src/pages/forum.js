import React, { useState, useEffect } from "react";
import './forum.css';
import Menu from "./menu";
import Footer from "./footer"
import { db, auth } from "../config/firebase";
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import {ref, uploadBytes } from 'firebase/storage';
import { Login } from "./login";
import { useNavigate } from 'react-router-dom';
import {signInWithPopup, signOut} from "firebase/auth";
import { googleProvider } from "../config/firebase";



function IndexList() {
    const [reviewList, setReviewList] = useState([])
    // New review States
    const [newProgram, setNewProgram] = useState("");
    const [newSchool, setNewSchool] = useState("");
    const [newReview, setNewReview] = useState("");

    const reviewsCollectionRef = collection(db, "Reviews")

    const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


    // Update Review States
   /* const [updatedSchool, setUpdatedSchool] = useState("")
    const [updatedProgram, setUpdatedProgram] = useState("")
    const [updatedReview, setUpdatedReview] = useState("")*/

//Showing user-email
useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            setUserEmail(user.email);
            setIsLoggedIn(true);
        } else {
            setUserEmail(null);
            setIsLoggedIn(false);
        }
    });
  
    return () => unsubscribe();
  }, []);
  
useEffect(() => {
    getReviewList();
}, []);


const getReviewList = async () => {
    try {
        const data = await getDocs(reviewsCollectionRef)
        const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setReviewList(filteredData);
    } catch (err) {
        console.error(err)
    }
    }

const onSubmitReview = async () => {
    if (!newProgram || !newSchool || !newReview) {
        alert('Please fill out all fields.');
        return;
    } else {
       
        // Clear modal input fields
        document.getElementById('reviewSchool').value = '';
        document.getElementById('reviewProgram').value = '';
        document.getElementById('reviewContent').value = '';

        // Hide the modal
        document.getElementById('reviewModal').style.display = 'none';
}
    try {
        await addDoc(reviewsCollectionRef, {
            Program: newProgram,
            School: newSchool,
            Review: newReview,
            userId: auth?.currentUser?.uid,
            userEmail: userEmail,
        }); 
        getReviewList();
    } catch (err) {
        console.error(err);
    }
}

const onLeaveReviewBtn= async () => {

        if (!isLoggedIn) {
            alert("User not logged in!");
            return;
        }
    try {
            document.getElementById('reviewModal').style.display = 'flex';
                      
            // Close the modal when clicking outside of it
            window.addEventListener('click', (event) => {
                if (event.target === document.getElementById('reviewModal')) {
                    document.getElementById('reviewModal').style.display = 'none';
                }
            });
    } catch (err) {
        console.error(err);
    }
}


const deleteReview= async (id) => {
    const reviewDoc = doc(db, "Reviews", id);
    await deleteDoc(reviewDoc);
    // Update local state to remove the deleted review
    setReviewList((prevReviews) => prevReviews.filter((review) => review.id !== id));          
    }

    //Edit Review
/*const editReview= async (id, ) => {
    const reviewDoc = doc(db, "Reviews", id);
    await updateDoc(reviewDoc, {School: setUpdatedSchool, Program: setUpdatedProgram, setUpdatedReview});
    // Update local state to remove the deleted review
    setReviewList((prevReviews) => prevReviews.filter((review) => review.id !== id)); 
}*/

return (
    <div>
    <Menu />

    <div className="search-container">
    <input id="search" className="search-box" placeholder="Enter your University . . " name=""/>
        <div className="suggestions" id="suggestions"></div>
</div>


<div className="forum-container">
    <div className="forum-title">Forum</div>
    <section className="reviews" id="reviews">
        Review

            <div className="modal-content">
            {reviewList.map((Review) => (
                <div className="review"> 
                    <div>Program: {Review.Program} </div>
                    <div>School: {Review.School} </div>
                    <div>Review: {Review.Review}</div>
                    <div>UserId: {Review.userId}</div>
                    <div>User: {Review.userEmail}</div>
                    <button onClick={() => deleteReview(Review.id)} className="deletebtn">X</button>
                    <button /*onClick={</div>() => editReview(Review.id)}*/ className="editbtn">Edit Review</button>
                </div>
            ))}
        </div>

    </section>
    <button onClick={onLeaveReviewBtn} className="leave-review-btn" id="leaveReviewBtn">Leave a Review</button>
</div>

<div className="modal" id="reviewModal">
    <div className="modal-content">
        <input type="text" id="reviewSchool" placeholder="Your School" onChange={(e) => setNewProgram(e.target.value)}/>
        <input type="text" id="reviewProgram" placeholder="Your Program" onChange={(e) => setNewSchool(e.target.value)}/>
        <textarea id="reviewContent" rows="8" placeholder="Your Review" onChange={(e) => setNewReview(e.target.value)}></textarea>
        <button onClick={onSubmitReview} id="submitReviewBtn">Submit</button>
    </div>
</div>
<Footer />
</div>
)
};

export default IndexList;
