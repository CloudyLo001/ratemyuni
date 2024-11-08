import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import "./reviewdetails.css";
import HomeMenu from "./homemenu";
import Footer from "./footer";

function ReviewDetails() {
  const { id } = useParams(); // Get the review ID from URL
  const [review, setReview] = useState(null);
  const [userInfoList, setUserInfoList] = useState([]); // Store all user info data here

  useEffect(() => {
    const fetchReviewAndUserInfoList = async () => {
      // Fetch the review data
      const reviewDoc = await getDoc(doc(db, "Questions and Answers", id));
      if (reviewDoc.exists()) {
        setReview(reviewDoc.data());
      } else {
        console.log("No such review document!");
      }
    };
    const fetchUserInfo = async () => {
      const userInfoCollectionRef = collection(db, "UserInfo");
      const data = await getDocs(userInfoCollectionRef);
      const userInfos = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserInfoList(userInfos);
    };

    fetchReviewAndUserInfoList();
    fetchUserInfo();
  }, []);

  if (review === null) {
    return <p>Loading...</p>;
  }

  // Find the user info corresponding to the review's userId
  const userInfo = userInfoList.find((user) => user.userId === review.userId);

  return (
    <div>
      <HomeMenu />
      <div className="review-details-container">
        <div className="review-card">
          <div className="review-item">
            {userInfo ? (
              <>
                <h4>{review.prompt}</h4>
                <div className="review-item">
                  - {userInfo.Program} student from Class of{" "}
                  {userInfo.ExpectedGraduationYear}
                </div>
              </>
            ) : (
              <p>Student information not available.</p>
            )}
          </div>
          <div className="review-item">
            <h4>Answer</h4>
            <p>{review.answer}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReviewDetails;
