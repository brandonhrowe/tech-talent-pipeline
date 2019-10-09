import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signup } from "../store";
import { renderInput } from "../utils";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      fields: [
        {
          name: "name",
          type: "text",
          placeholder: "Name"
        },
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
      ]
    };
    this.renderInput = renderInput.bind(this);
  }

  render() {
    const { fields } = this.state;
    const { handleSignup } = this.props;
    return (
      <div className="column is-half box has-text-centered">
        <h1 className="title has-text-black has-text-weight-bold is-1">
          STOCK UP
        </h1>
        <h2 className="has-text-black is-size-4">
          <u>REGISTER</u>
        </h2>
        <br />
        <div className="columns is-centered">
          <div className="column is-half">
            <form className="form" onSubmit={handleSignup}>
              {fields.map(({ name, type, placeholder }, i) => {
                return this.renderInput(name, type, placeholder, i);
              })}
              <div>
                <button className="button is-success" type="submit">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="columns is-centered">
          <div className="column is-narrow">
            <Link className="is-link has-text-black" to="/login">
              Log In
            </Link>
          </div>
          <div className="column is-narrow has-text-black laptop-only">|</div>
          <div className="column is-narrow">
            <Link className="is-link has-text-black" to="/signup">
              <u>Sign Up</u>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatch = (dispatch, prevProps) => ({
  handleSignup: e => {
    e.preventDefault();
    const { name, email, password } = e.target;
    const values = {
      name: name.value,
      email: email.value,
      password: password.value,
      history: prevProps.history
    };
    dispatch(signup(values));
  }
});

export default connect(
  null,
  mapDispatch
)(Signup);
