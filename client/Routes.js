import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Portfolio from "./components/Portfolio";
import Transactions from "./components/Transactions";

class Routes extends Component {
  render() {
    const { user } = this.props;
    return (
      <section className={"hero is-fullheight is-info"}>
        <div className="hero-body">
          <div className="container has-text-centered">
            <Switch>
              {user.id && (
                <Switch>
                  <Route path="/portfolio" component={Portfolio} />
                  <Route path="/transactions" component={Transactions} />
                  <Route component={Portfolio} />
                </Switch>
              )}
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route component={Login} />
            </Switch>
          </div>
        </div>
      </section>
    );
  }
}

const mapState = state => ({
  user: state.user
});

export default connect(mapState)(Routes);
