import React, { Component } from "react";
import { logout } from "../store";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      isActive: false
    };
    this.handleMobileClick = this.handleMobileClick.bind(this);
  }

  handleMobileClick() {
    this.setState(prevState => ({ isActive: !prevState.isActive }));
  }

  render() {
    const { handleLogout, user } = this.props;
    const { isActive } = this.state;
    return (
      <div
        className="navbar is-fixed-top is-black"
        role="navigation"
        aria-label="main-navigation"
      >
        <div className="navbar-brand">
          <div className="navbar-item is-logo has-text-weight-bold">
            STOCK UP
          </div>
          <a
            className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            role="button"
            data-target="navbarMenu"
            onClick={this.handleMobileClick}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div
          id="navbarMenu"
          className={`navbar-menu ${isActive ? "is-active" : ""}`}
        >
          <div className="navbar-end">
            <Link
              className="navbar-item"
              to="/portfolio"
              onClick={this.handleMobileClick}
            >
              Portfolio
            </Link>{" "}
            <div className="navbar-item desktop-only">|</div>
            <Link
              className="navbar-item"
              to="/transactions"
              onClick={this.handleMobileClick}
            >
              Transactions
            </Link>{" "}
            <div className="navbar-item desktop-only">|</div>
            <div
              className="navbar-item is-clickable"
              onClick={() => {
                handleLogout();
                this.handleMobileClick();
              }}
            >
              Log Out, {user.name}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  user: state.user
})

const mapDispatch = dispatch => ({
  handleLogout: () => dispatch(logout())
});

export default connect(
  mapState,
  mapDispatch
)(Header);
