import React from "react";
import "./bootstarp.min.css";

// import "./App.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Login from "./components/login";
import SignUp from "./components/register";
import Admin from "./layouts/Admin.js";

import "./assets/css/material-dashboard-react.css?v=1.10.0";
class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/admin" component={Admin} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
