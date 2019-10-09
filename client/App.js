import React, { Component } from "react";
import Header from "./components/Header";
import ErrorMessage from "./components/ErrorMessage";
import Routes from "./Routes";
import { currUser, auth } from "./store";
import { connect } from "react-redux";

class App extends Component {
  componentDidMount() {
    this.props.loadUser();
  }

  render() {
    const { user, error } = this.props;
    return (
      <div>
        {user.id ? <Header /> : null}
        <Routes user={user} />
        {error ? <ErrorMessage /> : null}
      </div>
    );
  }
}

const mapState = state => ({
  user: state.user,
  error: state.error
});

const mapDispatch = dispatch => ({
  loadUser: () => dispatch(currUser())
});

export default connect(
  mapState,
  mapDispatch
)(App);
