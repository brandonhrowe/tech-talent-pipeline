import React, { Component } from "react";
import Header from "./components/Header";
import Routes from "./Routes";
import { currUser, auth } from "./store";
import { connect } from "react-redux";

class App extends Component {
  componentDidMount() {
    this.props.loadUser();
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        {user.id ? <Header user={user} /> : null}
        <Routes user={user} />
      </div>
    );
  }
}

const mapState = state => ({
  user: state.user
});

const mapDispatch = dispatch => ({
  loadUser: () => dispatch(currUser())
});

export default connect(
  mapState,
  mapDispatch
)(App);
