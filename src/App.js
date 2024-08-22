import logo from './logo.svg';
import './App.css';
import IndexList from "./pages/forum";
import HomePage from "./pages/home";
import Login from "./pages/login";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forum" element={<IndexList />} />
          {/*<Route path="/login" element={<Login />} />*/}

        </Routes>
      </Router>

    </div>
  );
}

export default App;
