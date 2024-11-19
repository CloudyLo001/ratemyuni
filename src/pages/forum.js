import React, { useState, useEffect } from "react";
import "./forum.css";
import HomeMenu from "./homemenu";
import Footer from "./footer";
import { db, googleProvider, auth } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { getDocs, collection, addDoc, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function IndexList() {
  const [reviewList, setReviewList] = useState([]);
  const [userinfoList, setUserInfoList] = useState([]);
  const [LevelOfEducationFilter, setLevelOfEducationFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(5); // State to track visible reviews
  const navigate = useNavigate();

  //Filters
  const [topicFilter, setTopicFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [dateOrder, setDateOrder] = useState("desc");

  // States for filter options
  const [topicOptions, setTopicOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);

  useEffect(() => {
    // Fetch reviews and unique topics
    const fetchReviews = async () => {
      const reviewsCollectionRef = collection(db, "Questions and Answers");
      const data = await getDocs(reviewsCollectionRef);
      const reviews = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setReviewList(reviews);

      // Extract unique topics for topic filter options
      const topics = new Set();
      reviews.forEach((review) => {
        if (review.topic) topics.add(review.topic);
      });
      setTopicOptions([...topics]);
    };

    // Fetch user information for program and level options
    const fetchUserInfo = async () => {
      const userInfoCollectionRef = collection(db, "UserInfo");
      const data = await getDocs(userInfoCollectionRef);
      const userInfoList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserInfoList(userInfoList);

      // Extract unique programs and levels for filter options
      const programs = new Set();
      const levels = new Set();
      userInfoList.forEach((user) => {
        if (user.Program) programs.add(user.Program);
        if (user.LevelOfEducation) levels.add(user.LevelOfEducation);
      });

      setProgramOptions([...programs].sort());
      setLevelOptions([...levels]);
    };

    fetchReviews();
    fetchUserInfo();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Check if user is a first-time user
      const userRef = doc(db, "Users", result.user.uid);
      const userDoc = await getDocs(userRef);

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
  const handleLeaveReview = async () => {
    if (auth.currentUser) {
      // Check if it's the user's first time logging in
      const user = auth.currentUser;
      const isNewUser =
        user.metadata.creationTime === user.metadata.lastSignInTime;

      if (isNewUser) {
        navigate("/userinfo"); // Navigate to userinfo page if new user
      } else {
        navigate("/questions"); // Navigate to review page if returning user
      }
    } else {
      // Sign in with Google if not authenticated
      await signInWithGoogle();
    }
  };

  const filteredReviews = reviewList
    .filter((review) => {
      const userInfo = userinfoList.find(
        (user) => user.userId === review.userId
      );

      if (topicFilter && review.topic !== topicFilter) return false;
      if (programFilter && userInfo?.Program !== programFilter) return false;
      if (levelFilter && userInfo?.LevelOfEducation !== levelFilter)
        return false;

      return true;
    })
    .sort((a, b) =>
      dateOrder === "desc"
        ? b.timestamp?.toMillis() - a.timestamp?.toMillis()
        : a.timestamp?.toMillis() - b.timestamp?.toMillis()
    );

  // Get only the visible reviews
  const displayedReviews = filteredReviews.slice(0, visibleCount);

  const loadMoreReviews = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Load 3 more reviews
  };

  const formatReviewDate = (postedDate) => {
    const now = new Date();
    const posted = new Date(postedDate);
    const diffInMillis = now - posted;
    const diffInSeconds = Math.floor(diffInMillis / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInSeconds < 60) {
      return "Posted today";
    } else if (diffInMinutes < 60) {
      return `Posted ${diffInMinutes} minute${
        diffInMinutes > 1 ? "s" : ""
      } ago`;
    } else if (diffInHours < 24) {
      return `Posted ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInDays < 30) {
      return `Posted ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInMonths < 12) {
      return `Posted ${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    } else {
      return `Posted ${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div>
      <HomeMenu />
      <body>
        <div className="container-forum-filter">
          <div className="forum-container">
            <div className="forum-title-container">
              <div className="forum-title">University of Waterloo</div>
              <button className="leave-review-btn" onClick={handleLeaveReview}>
                Leave a Review
              </button>
            </div>
            <section className="reviews">
              <div className="modal-content">
                {displayedReviews.map((review) => {
                  const userInfo = userinfoList.find(
                    (user) => user.userId === review.userId
                  );

                  return (
                    <Link
                      to={`/review/${review.id}`}
                      key={review.id}
                      className="review-link"
                    >
                      <div className="review">
                        <div className="prompt">{review.prompt}</div>
                        <div className="answer">{review.answer}</div>
                        {userInfo ? (
                          <div className="user-info">
                            - {userInfo.Program} student from Class of{" "}
                            {userInfo.ExpectedGraduationYear}
                          </div>
                        ) : (
                          <div>- student information not available</div>
                        )}
                        <div className="timestamp">
                          {formatReviewDate(review.timestamp?.toDate())}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {visibleCount < filteredReviews.length && ( // Show button only if there are more reviews to show
                <button className="more-reviews-btn" onClick={loadMoreReviews}>
                  More Reviews
                </button>
              )}
            </section>
          </div>

          {/*Filter*/}
          <div className="filter-container">
            <h3>Filter</h3>
            <label>
              Topic:
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
              >
                <option value="">All Topics</option>
                {topicOptions.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>
            {/* Program Filter */}
            <label>
              Program:
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                <option value="">All Programs</option>
                {programOptions.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </label>
            {/* Level of Education Filter */}
            <label>
              Level of Education:
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="">All Levels</option>
                {levelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </body>
      <Footer />
    </div>
  );
}

export default IndexList;
