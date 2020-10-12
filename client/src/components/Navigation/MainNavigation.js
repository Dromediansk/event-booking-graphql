import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

const MainNavigation = () => {
  const authContext = useContext(AuthContext);

  console.log(authContext);

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
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
            <>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={authContext.logout}>Log out</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
