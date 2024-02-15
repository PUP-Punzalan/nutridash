import React from "react";
import { useNavigate, NavLink } from "react-router-dom";

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
        <div className=" navbar__title">
          <h5 className="responsive-title">Nutridash</h5>
          <img
            className="responsive-icon icon-image"
            src="https://cdn.discordapp.com/attachments/1165639721993646081/1207513498117218375/received_1008473177392327_prev_ui_1.png?ex=65dfeb94&is=65cd7694&hm=13114cc27f4e854134e6228567a08603f9faecb3417279d3e3d4b1b1cedb6918&"
          ></img>
        </div>
        <ul className="navbar__buttons">
          <li>
            <NavLink className="navbar__button" to="/home">
              <span className="material-symbols-rounded responsive">home</span>
              <p className="responsive-icon">Home</p>
            </NavLink>
          </li>
          <li>
            <NavLink className="navbar__button" to="/food-list">
              <span className="material-symbols-rounded responsive">
                nutrition
              </span>
              <p className="responsive-icon">Food List</p>
            </NavLink>
          </li>
          <li>
            <NavLink className="navbar__button" to="/add-food">
              <span className="material-symbols-rounded responsive">add</span>
              <p className="responsive-icon">Add food</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              className="navbar__button"
              to={`/profile/${token.user.id}`}
            >
              <span className="material-symbols-rounded responsive">
                person
              </span>
              <p className="responsive-icon">Profile</p>
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
