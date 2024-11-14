import logo from "./logo.svg";
import "./App.css";
import IndexList from "./pages/forum";
import HomePage from "./pages/home";
import Q1 from "./pages/question/q1";
import Q2 from "./pages/question/q2.js";
import Q3 from "./pages/question/q3.js";
import Questions from "./pages/question/questions.js";
import LoginButton from "./pages/login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserInfo from "./pages/userinfo";
import ReviewDetails from "./pages/reviewdetails";
import About from "./pages/about";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forum" element={<IndexList />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/Q1" element={<Q1 />} />
          <Route path="/Q2" element={<Q2 />} />
          <Route path="/Q3" element={<Q3 />} />
          <Route path="/login" element={<LoginButton />} />
          <Route path="/review/:id" element={<ReviewDetails />} />
          <Route path="/about" element={<About />} />
          {/*<Route path="/login" element={<Login />} />*/}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
