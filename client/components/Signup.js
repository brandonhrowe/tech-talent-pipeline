import React, { Component } from "react";
import { Link } from "react-router-dom";

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
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="columns is-centered">
              <div className="column is-half">
                <form className="form">
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

export default Signup;
