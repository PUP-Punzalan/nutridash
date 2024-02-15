import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./pages/Hero";
import Home from "./pages/Home";
import AddFood from "./pages/AddFood";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import NavBar from "./components/NavBar";
import Admin from "./pages/Admin";

const App = () => {
  const [token, setToken] = useState(false);

  const [hasToken, setHasToken] = useState(false);

  if (token) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let data = JSON.parse(sessionStorage.getItem("token"));
      setToken(data);
    }

    if (token) {
      setHasToken(true);
    } else {
      setHasToken(false);
    }
  }, []);

  return (
    <BrowserRouter>
      {token ? <NavBar token={token}></NavBar> : null}
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<SignIn setToken={setToken} />} />
        {token ? (
          <Route
            path={"/home"}
            element={<Home key={token.user.id} token={token} />}
          />
        ) : (
          ""
        )}
        {token ? (
          <Route
            path={"/admin"}
            element={<Admin key={token.user.id} token={token} />}
          />
        ) : (
          ""
        )}
        {token ? (
          <Route
            path="/food-list"
            element={<Hero key={token.user.id} token={token} />}
          />
        ) : (
          ""
        )}
        {token ? (
          <Route
            path="/add-food"
            element={<AddFood key={token.user.id} token={token} />}
          />
        ) : (
          ""
        )}

        {token ? (
          <Route
            path="/profile/:id"
            element={<Profile key={token.user.id} token={token} />}
          />
        ) : (
          ""
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
