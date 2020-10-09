import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

import "./MainNavigation.scss";

const MainNavigation = () => {
  const authContext = useContext(AuthContext);

  console.log(authContext);

  return (
    <header className="main-navigation">
      <div className="main-navigatino__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navgation__items">
        <ul>
          {!authContext.token && (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          )}

          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {authContext.token && (
            <li>
              <NavLink to="/bookings">Bookings</NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
