import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import MainNavigation from "./components/Navigation/MainNavigation";
import "./App.scss";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";

function App() {
  return (
    <BrowserRouter>
      <>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/bookings" component={BookingsPage} />
          </Switch>
        </main>
      </>
    </BrowserRouter>
  );
}

export default App;
