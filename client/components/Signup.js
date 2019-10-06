import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signup } from "../store";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      fields: [
        {
          name: "name",
          type: "text"
        },
        {
          name: "email",
          type: "email"
        },
        {
          name: "password",
          type: "password"
        }
      ],
      errors: {}
    };
  }

  // signup(e) {
  //   e.preventDefault();
  //   const { name, email, password } = e.target;
  //   const values = {
  //     name: name.value,
  //     email: email.value,
  //     password: password.value,
  //     method: "signup"
  //   };
  //   console.log(this.props)
  //   this.props.handleSignup(values);
  // }

  renderInput(name, type, i) {
    return (
      <div key={i} className="field">
        <label className="label has-text-centered">
          <small>{name}</small>
        </label>
        <div className="control">
          <input
            className="input"
            name={name}
            type={type}
            onChange={() =>
              this.setState({
                errors: { ...this.state.errors, [name]: null }
              })
            }
          />
          <p className="help has-text-danger">
            {this.state.errors[name] && this.state.errors[name].message}
          </p>
        </div>
      </div>
    );
  }

  render() {
    const { fields } = this.state;
    const { handleSignup } = this.props;
    return (
      <section className="hero is-fullheight is-danger">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title has-text-black">STOCK UP</h1>
            <div className="columns is-centered">
              <div className="column is-narrow">
                <Link className="is-link has-text-black" to="/login">
                  Log In
                </Link>
              </div>
              <div className="column is-narrow has-text-black">|</div>
              <div className="column is-narrow">
                <Link className="is-link has-text-black" to="/signup">
                  <u>Sign Up</u>
                </Link>
              </div>
            </div>
            <div className="columns is-centered">
              <div className="column is-half">
                <form className="form" onSubmit={handleSignup}>
                  {fields.map(({ name, type }, i) => {
                    return this.renderInput(name, type, i);
                  })}
                  <div>
                    <button className="button is-success" type="submit">
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
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
