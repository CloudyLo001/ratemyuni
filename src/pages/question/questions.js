import React, { useState, useEffect } from "react";
import { db, auth } from "../../config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../footer";
import HomeMenu from "../homemenu";

function Questions() {
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { universityId } = useParams();
  const universityName = decodeURIComponent(universityId); // Use universityId directly
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch topics from Firestore
    const fetchTopics = async () => {
      try {
        const topicsCollection = collection(db, "Topics");
        const topicSnapshot = await getDocs(topicsCollection);
        const loadedTopics = topicSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTopics(loadedTopics);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  const handleTopicChange = (e) => {
    const selected = topics.find((topic) => topic.Topic === e.target.value);
    if (selected) {
      setSelectedTopic(selected.Topic);
      setQuestions(selected.Prompt || []);
      setSelectedQuestion("");
    } else {
      setSelectedTopic("");
      setQuestions([]);
    }
  };

  const handleQuestionChange = (e) => {
    setSelectedQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) {
      alert("Please select a question before submitting.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
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
        University: universityName,
      });
      setAnswerText("");
      setSelectedTopic("");
      setSelectedQuestion("");
      setQuestions([]);
      navigate(`/forum/${universityId}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("An error occurred while submitting the information.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <HomeMenu />
      <div className="qa-form">
        <h2>Leave a Review for {universityName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="dropdown-container">
            <label htmlFor="topic">Select Topic:</label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={handleTopicChange}
              required
            >
              <option value="" disabled>
                -- Select a Topic --
              </option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.Topic}>
                  {topic.Topic}
                </option>
              ))}
            </select>

            {selectedTopic && (
              <>
                <label htmlFor="question">Select Prompt:</label>
                <select
                  id="question"
                  value={selectedQuestion}
                  onChange={handleQuestionChange}
                  required
                >
                  <option value="" disabled>
                    -- Select a Prompt --
                  </option>
                  {questions.map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          {selectedQuestion && (
            <>
              <label htmlFor="answer">Your Answer:</label>
              <textarea
                id="answer"
                rows="4"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                required
                style={{ resize: "none", width: "100%" }}
              />
            </>
          )}

          <button type="submit" disabled={!selectedQuestion || !answerText}>
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Questions;
