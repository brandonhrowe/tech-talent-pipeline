import React, { Component } from "react";
import { Link } from "react-router-dom";

class AuthTemplate extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      login: true,
      errors: {}
    };
  }

  componentDidMount() {
    const { path } = this.props.match;
    if (path === "/signup") {
      this.setState({
        login: false
      });
    }
  }

  render() {
    const { login } = this.state;
    return (
      <section className="hero is-fullheight is-danger">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title has-text-black"><u>STOCK UP</u></h1>
            <div className="columns is-centered">
              <div className="column is-narrow">
              <Link className="is-link has-text-black" to="/login">
                  Log In
                </Link>
              </div>
              <div className="column is-narrow has-text-black">|</div>
              <div className="column is-narrow">
              <Link className="is-link has-text-black" to="/signup">
                  Sign Up
                </Link>
              </div>
            </div>
            <Link className="button is-link has-text-black" to="/signup">
              {login ? "Log In" : "Sign Up"}
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

export default AuthTemplate;
