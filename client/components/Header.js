import React, { Component } from "react";
import { logout } from "../store";
import { connect } from "react-redux";

class Header extends Component {
  render() {
    const { handleLogout } = this.props;
    return (
      <div className="button" onClick={handleLogout}>
        Log Out
      </div>
    );
  }
}

const mapDispatch = dispatch => ({
  handleLogout: () => dispatch(logout())
});

export default connect(
  null,
  mapDispatch
)(Header);
