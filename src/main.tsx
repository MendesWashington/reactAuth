import React from "react";
import ReactDOM from "react-dom/client";
import "./Global.css";

import { App } from "./App";
import { AuthProvider } from "./contexts/AuthContext";

import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/Dashboard/Dashboard";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path="/">
            <App />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
