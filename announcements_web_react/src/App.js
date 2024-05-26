import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Cookies from "js-cookie";

import "./App.css";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Home from "./pages/Home/Home";
import Create from "./pages/Create/Create";
import List from "./pages/List/List";
import Details from "./pages/Details/Details";
import Edit from "./pages/Edit/Edit";

function App() {
  const [userId, setUserId] = useState(Cookies.get("user_id"));

  const logOut = () => {
    setUserId(null);
    Cookies.remove("user_id");
  };

  const onLogin = (val) => {
    setUserId(val);
    Cookies.set("user_id", val, { path: "/" });
  };

  return (
    <Router>
      <header>
        <div className="top-menu">
          <Link to="/" style={{ textDecoration: "none" }}>
            <h1 className="title">Announcements Web</h1>
          </Link>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            {userId && (
              <>
                <li>
                  <Link to="/announcements/local">Local List</Link>
                </li>

                <li>
                  <Link to="/announcements/create">Create</Link>
                </li>
              </>
            )}
            {userId ? (
              <li className="access side dropdown">
                <a
                  className="nav-link dropdown-toggle action_link"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Actions
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <button className="dropdown-item logout" onClick={logOut}>
                    Logout
                  </button>
                </div>
              </li>
            ) : (
              <>
                <li className="access side">
                  <Link to="/login">Log In</Link>
                </li>
                <li className="access">
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
            {/* {% endif %} */}
          </ul>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<SignIn onLogin={onLogin} />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/announcements/create" element={<Create />} />
          <Route path="/announcement/:id" element={<Details />} />
          <Route path="/edit/announcement/:id" element={<Edit />} />
          <Route path="/announcements/*" element={<List />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
