import React from "react";
import { connect } from "react-redux";

const ErrorMessage = ({ error }) => (
  <div className="columns is-centered">
    <div id="error-message" className="box is-danger column has-text-centered is-one-quarter is-size-5">
      {error}
    </div>
  </div>
);

const mapState = state => ({
  error: state.error
});

export default connect(mapState)(ErrorMessage);
