import React, { useState, useEffect } from "react";
import { db, auth } from "../../config/firebase"; // Ensure you have initialized Firebase
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Footer from "../footer";
import HomeMenu from "../homemenu";

function Questions() {
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [hoveredTopic, setHoveredTopic] = useState(null);
  const [hoveredQuestions, setHoveredQuestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch topics and questions from Firebase
    const fetchTopics = async () => {
      try {
        const topicsCollection = collection(db, "Topics");
        const topicSnapshot = await getDocs(topicsCollection);
        const loadedTopics = topicSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Fetch all fields in the document, including "Prompt"
        }));
        setTopics(loadedTopics);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  const handleMouseEnter = () => {
    setIsOpen(true); // Open the dropdown on hover
  };

  const handleMouseLeave = () => {
    setIsOpen(false); // Close the dropdown when not hovering
    setHoveredTopic(null); // Optional: reset hovered topic
  };

  const handleTopicHover = (topic) => {
    setHoveredTopic(topic); // Set the hovered topic'
    setSelectedTopic(topic.Topic || []);
  };
  const handleTopicLeave = () => {
    setHoveredTopic(null); // Clear the hovered topic
  };

  // Handle topic selection
  const handleTopicClick = (topic) => {
    if (selectedTopic === topic.Topic) {
      // Close the submenu if already selected
      setSelectedTopic("");
      setQuestions([]);
    } else {
      // Set selected topic and fetch questions
      setSelectedTopic(topic.Topic);
      setQuestions(topic.Prompt || []); // Ensure Prompt is an array of questions
    }
    setSelectedQuestion(""); // Reset question selection
  };

  // Handle topic selection
  const handleTopicChange = (e) => {
    const selected = topics.find((topic) => topic.Topic === e.target.value);
    if (selected) {
      setSelectedTopic(selected.Topic);
      setQuestions(selected.Prompt); // Ensure this exists
      setSelectedQuestion(""); // Clear previously selected question
    } else {
      console.error("Selected topic not found");
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question); // Set the selected question
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) {
      alert("Please select a question before submitting.");
      return;
    }

    try {
      if (!auth.currentUser) {
        throw new Error("User not authenticated");
      }
      await addDoc(collection(db, "Questions and Answers"), {
        answer: answerText,
        prompt: selectedQuestion,
        UserEmail: auth.currentUser.email,
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
        topic: selectedTopic,
      });
      setAnswerText(""); // Clear the input after submission
      setQuestions([]);
      setSelectedTopic(""); // Reset topic selection
      setSelectedQuestion(""); // Reset question selection
      setQuestions([]); // Clear questions
      navigate("/forum");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("An error occurred while submitting the information.");
    }
  };

  return (
    <div>
      <HomeMenu />

      <div className="qa-form">
        {/* Dropdown for selecting topic */}
        <div className="dropdown-container">
          <div
            className="dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              id="topicDropdown"
              value={selectedTopic}
              className="option-button"
            >
              {selectedTopic || "Select prompt . . ."}
            </button>
            <div className="topic">
              {isOpen && (
                <div className="topic-box">
                  <ul value="" disabled>
                    {topics.map((topic) => (
                      <li
                        className="menu"
                        key={topic.id}
                        value={topic.Topic}
                        onMouseEnter={() => handleTopicHover(topic)}
                        onMouseLeave={handleTopicLeave}
                      >
                        {topic.Topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hoveredTopic && (
                <div
                  className="questions-container"
                  onMouseEnter={() => handleTopicHover(hoveredTopic)} // Keep open on hover
                  onMouseLeave={handleTopicLeave} // Close when leaving
                >
                  <ul>
                    {Array.isArray(hoveredTopic.Prompt) &&
                      hoveredTopic.Prompt.map((question, index) => (
                        <li
                          key={index}
                          onClick={() => handleQuestionClick(question)}
                        >
                          {question}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div>Question: {selectedQuestion}</div>

          <form onSubmit={handleSubmit}>
            <textarea
              rows="4"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              required
              style={{ resize: "none", overflow: "hidden" }}
            />
            <button className="submit">Submit</button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Questions;
