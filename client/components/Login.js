import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../store";
import { renderInput } from "../utils";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      fields: [
        {
          name: "email",
          type: "email",
          placeholder: "Email"
        },
        {
          name: "password",
          type: "password",
          placeholder: "Password"
        }
      ],
      errors: {}
    };
    this.renderInput = renderInput.bind(this);
  }

  render() {
    const { fields } = this.state;
    const { handleLogin } = this.props;
    return (
      <div className="column is-half box has-text-centered">
        <h1 className="title has-text-black has-text-weight-bold is-1">
          STOCK UP
        </h1>
        <h2 className="has-text-black is-size-4">
          <u>SIGN IN</u>
        </h2>
        <br />
        <div className="columns is-centered">
          <div className="column is-half">
            <form className="form" onSubmit={handleLogin}>
              {fields.map(({ name, type, placeholder }, i) => {
                return this.renderInput(name, type, placeholder, i);
              })}
              <div>
                <button className="button is-success" type="submit">
                  Log In
                </button>
                <br />
              </div>
            </form>
          </div>
        </div>
        <div className="columns is-centered">
          <div className="column is-narrow">
            <Link className="is-link has-text-black" to="/login">
              <u>Log In</u>
            </Link>
          </div>
          <div className="column is-narrow has-text-black laptop-only">|</div>
          <div className="column is-narrow">
            <Link className="is-link has-text-black" to="/signup">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatch = (dispatch, prevProps) => ({
  handleLogin: e => {
    e.preventDefault();
    const { email, password } = e.target;
    const values = {
      email: email.value,
      password: password.value,
      history: prevProps.history
    };
    dispatch(login(values));
  }
});

export default connect(
  null,
  mapDispatch
)(Login);
