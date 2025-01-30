import React, { useState, useEffect, useRef } from "react";
import "./forum.css";
import HomeMenu from "./homemenu";
import Footer from "./footer";
import { db, googleProvider, auth } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  getDocs,
  getDoc,
  collection,
  addDoc,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function ForumPage() {
  const [reviewList, setReviewList] = useState([]);
  const [userinfoList, setUserInfoList] = useState([]);
  const [LevelOfEducationFilter, setLevelOfEducationFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(5); // State to track visible reviews
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [reviewsPerPage] = useState(5);
  const navigate = useNavigate();
  const firstReviewRef = useRef(null);
  const [universityData, setUniversityData] = useState({});

  //Filters
  const [topicFilter, setTopicFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [dateOrder, setDateOrder] = useState("desc");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // States for filter options
  const [topicOptions, setTopicOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);

  const { id } = useParams(); // Get university ID from URL
  useEffect(() => {
    // Fetch reviews and unique topics
    const fetchUniversityData = async () => {
      if (!id) {
        console.error("No university ID provided!");
        return;
      }

      const uniRef = doc(db, "Universities", decodeURIComponent(id));

      try {
        const uniSnap = await getDoc(uniRef);

        if (uniSnap.exists()) {
          console.log("Firestore document data:", uniSnap.data());
          setUniversityData(uniSnap.data());
        } else {
          console.error("No document found in Firestore for ID:", id);
        }
      } catch (err) {
        console.error("Error fetching university data:", err);
      }
    };

    const fetchReviews = async () => {
      if (!id) return; // Ensure `id` is available (university ID for this page)

      const reviewsCollectionRef = collection(db, "Questions and Answers");

      // Start with a query for the university
      let q = query(
        reviewsCollectionRef,
        where("University", "==", decodeURIComponent(id))
      );

      // Add additional filters for Level of Education and Program if provided
      if (levelFilter) {
        q = query(q, where("LevelOfEducation", "==", levelFilter)); // Filter by LevelOfEducation
      }

      if (programFilter) {
        q = query(q, where("Program", "==", programFilter)); // Filter by Program
      }

      // Filter by topic if provided
      if (topicFilter) {
        q = query(q, where("topic", "==", topicFilter)); // Filter by topic
      }

      try {
        const data = await getDocs(q); // Execute the query
        const reviews = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setReviewList(reviews);

        // Extract unique topics for topic filter options
        const topics = new Set();
        const programs = new Set();
        const levels = new Set();

        reviews.forEach((review) => {
          if (review.topic) topics.add(review.topic); // Add topic to topics set
          if (review.Program) programs.add(review.Program); // Add program to programs set
          if (review.LevelOfEducation) levels.add(review.LevelOfEducation); // Add level to levels set
        });

        setTopicOptions([...topics]);
        setProgramOptions([...programs].sort());
        setLevelOptions([...levels].sort());
      } catch (err) {
        console.error("Error fetching reviews: ", err);
      }
    };

    // Fetch user information for program and level options
    const fetchUserInfo = async () => {
      const userInfoCollectionRef = collection(db, "UserInfo");
      const data = await getDocs(userInfoCollectionRef);
      const userInfos = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUserInfoList(userInfos);

      // Extract unique programs and levels for filter options
      const programs = new Set();
      const levels = new Set();

      userInfos.forEach((user) => {
        if (user.Program) programs.add(user.Program); // Add unique programs
        if (user.LevelOfEducation) levels.add(user.LevelOfEducation); // Add unique levels
      });

      setProgramOptions([...programs].sort());
      setLevelOptions([...levels].sort());
    };
    console.log("useEffect triggered with ID:", id);
    fetchUniversityData();
    fetchReviews();
    fetchUserInfo();
  }, [id, levelFilter, programFilter, topicFilter]);

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
        navigate(`/questions/${encodeURIComponent(universityData.University)}`);
      }
    } catch (err) {
      console.error("Error signing in with Google:", err);
    }
  };
  const handleLeaveReview = async () => {
    if (auth.currentUser) {
      // Get the current user's email
      const userEmail = auth.currentUser.email;

      // Query Firestore to check if the user exists by email
      const userDocRef = collection(db, "UserInfo");
      const q = query(userDocRef, where("UserEmail", "==", userEmail));

      try {
        // Fetch documents matching the query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // User doesn't exist in the database, treat as new user

          navigate("/userinfo"); // Navigate to userinfo page to gather additional info
        } else {
          // User exists in the database, treat as returning user

          navigate(
            `/questions/${encodeURIComponent(universityData.University)}`
          ); // Navigate to the questions page for returning users
        }
      } catch (err) {
        console.error("Error checking user in Firestore:", err);
      }
    } else {
      // If no user is logged in, initiate Google Sign-In
      await signInWithGoogle();

      // After sign-in, rerun the user check
      if (auth.currentUser) {
        const userEmail = auth.currentUser.email;

        // Query Firestore to check if the user exists by email
        const userDocRef = collection(db, "UserInfo");
        const q = query(userDocRef, where("UserEmail", "==", userEmail));

        try {
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            // New user, navigate to userinfo page

            navigate("/userinfo");
          } else {
            // Returning user, navigate to questions page

            navigate(
              `/questions/${encodeURIComponent(universityData.University)}`
            );
          }
        } catch (err) {
          console.error("Error checking user in Firestore:", err);
        }
      }
    }
  };

  const filteredReviews = reviewList
    .filter((review) => {
      const userInfo = userinfoList.find(
        (user) => user.userId === review.userId
      );

      const matchesSearch =
        !searchFilter ||
        searchFilter
          .split(" ")
          .every(
            (word) =>
              review.prompt?.toLowerCase().includes(word) ||
              review.answer?.toLowerCase().includes(word)
          );

      if (!matchesSearch) return false; // Skip if it doesn't match search
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

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const displayedReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);

      // Scroll to the first review after page change
      if (firstReviewRef.current) {
        const topPosition =
          firstReviewRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: topPosition - 50, // Adjust the scroll position higher by 50px
          behavior: "smooth",
        });
      }
    }
  };

  // Handle form submission to apply the search query
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchFilter(searchQuery.trim().toLowerCase());
    setCurrentPage(1); // Reset to first page on search
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const delta = 2; // Number of pages to show around the current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={i === currentPage ? "active-page" : ""}
          >
            {i}
          </button>
        );
      } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
        pageNumbers.push(<span key={i}>...</span>);
      }
    }

    return pageNumbers;
  };

  {
    /*
  // Get only the visible reviews
  const displayedReviews = filteredReviews.slice(0, visibleCount);

  const loadMoreReviews = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Load 3 more reviews
  };*/
  }

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
        <div className="uni-info">
          <div className="uni-info-container">
            <div className="forum-title">{universityData.University}</div>
            <div className="uni-description">{universityData.Description}</div>
          </div>
          {/*<div className="uni-rating">3.9 stars</div>*/}
        </div>
        <div className="container-forum-filter">
          <div className="forum-container">
            <div className="forum-title-container">
              <button className="leave-review-btn" onClick={handleLeaveReview}>
                Leave a Review
              </button>
            </div>
            <section className="reviews">
              <div className="modal-content">
                {displayedReviews.map((review, index) => {
                  const userInfo = userinfoList.find(
                    (user) => user.userId === review.userId
                  );

                  return (
                    <Link
                      to={`/review/${review.id}`}
                      key={review.id}
                      className="review-link"
                    >
                      <div
                        ref={index === 0 ? firstReviewRef : null}
                        className="review"
                      >
                        <div className="prompt">{review.prompt}</div>
                        <div className="answer">{review.answer}</div>
                        {userInfo ? (
                          <div className="user-info">
                            - {userInfo.Program} student from Class of{" "}
                            {userInfo.ExpectedGraduationYear}
                          </div>
                        ) : (
                          <div className="user-info">
                            - student information not available
                          </div>
                        )}
                        <div className="timestamp">
                          {formatReviewDate(review.timestamp?.toDate())}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {/*{visibleCount < filteredReviews.length && ( // Show button only if there are more reviews to show
                <button className="more-reviews-btn" onClick={loadMoreReviews}>
                  More Reviews
                </button>
              )}*/}
              <div className="pagination-controls">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {renderPageNumbers()}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </section>
          </div>

          {/*Filter*/}
          <div className="filter-container">
            <h3>Sort by</h3>
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
            <label>
              <form onSubmit={handleSearchSubmit}>
                <textarea
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-search-bar"
                />
              </form>
            </label>
          </div>
        </div>
      </body>
      <Footer />
    </div>
  );
}

export default ForumPage;
