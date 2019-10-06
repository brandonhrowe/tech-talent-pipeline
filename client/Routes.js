import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Portfolio from "./components/Portfolio";
import Transactions from "./components/Transactions";

class Routes extends Component {
  render() {
    const { user } = this.props;
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        {user.id && (
          <Switch>
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/transactions" component={Transactions} />
            <Route component={Portfolio} />
          </Switch>
        )}
        <Route component={Signup} />
      </Switch>
    );
  }
}

export default Routes;
