import React from "react";
import { useNavigate } from "react-router-dom/dist/umd/react-router-dom.development";
import { NavLink } from "react-router-dom/dist/umd/react-router-dom.development";

const NavBar = ({ token }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  console.log("Token ", token);

  return (
    <div className="navbar--wrapper">
      <div>
        <div className="responsive navbar__title">
          <h5 className="">Nutridash</h5>
        </div>
        <ul className="navbar__buttons">
          <li>
            <NavLink
              className="navbar__button"
              activeClassName="active"
              exact
              to="/home"
            >
              <span className="material-symbols-rounded responsive">home</span>
              <p className="">Home</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              className="navbar__button"
              activeClassName="active"
              to="/food-list"
            >
              <span className="material-symbols-rounded responsive">
                nutrition
              </span>
              <p className="">Food List</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              className="navbar__button"
              activeClassName="active"
              to="/add-food"
            >
              <span className="material-symbols-rounded responsive">add</span>
              <p className="">Add food</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              className="navbar__button"
              activeClassName="active"
              to={`/profile/${token.user.id}`}
            >
              <span className="material-symbols-rounded responsive">
                person
              </span>
              <p className="">Profile</p>
            </NavLink>
          </li>
        </ul>
      </div>
      <button onClick={handleLogout} className="button logout-button">
        <span className="material-symbols-rounded">logout</span>
        <p className="responsive">Log out</p>
      </button>
    </div>
  );
};

export default NavBar;
