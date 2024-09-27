import logo from "./logo.svg";
import "./App.css";
import IndexList from "./pages/forum";
import HomePage from "./pages/home";
import Questionaire from "./pages/question/questionaire";
import Login from "./pages/login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserInfo from "./pages/userinfo";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forum" element={<IndexList />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="/questionaire" element={<Questionaire />} />
          {/*<Route path="/login" element={<Login />} />*/}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
