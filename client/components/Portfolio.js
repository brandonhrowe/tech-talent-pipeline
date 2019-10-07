import React, { Component } from "react";
import StockForm from "./StockForm";

class Portfolio extends Component {
  render() {
    return (
      <div className="columns">
        <div className="column is-half">
          <h2 className="is-size-2">
            <u>PORTFOLIO</u>
          </h2>
        </div>
        <StockForm />
      </div>
    );
  }
}

export default Portfolio;
