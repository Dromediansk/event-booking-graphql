import React from "react";
import { NavLink } from "react-router-dom";

import "./MainNavigation.scss";

const MainNavigation = () => (
  <header className="main-navigation">
    <div className="main-navigatino__logo">
      <h1>EasyEvent</h1>
    </div>
    <nav className="main-navgation__items">
      <ul>
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>

        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">Bookings</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default MainNavigation;
