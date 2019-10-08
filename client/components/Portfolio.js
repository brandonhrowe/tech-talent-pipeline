import React, { Component } from "react";
import { connect } from "react-redux";
import { getPortfolio } from "../store";
import { decimalCleaner } from "../utils";
import StockForm from "./StockForm";

class Portfolio extends Component {
  async componentDidMount() {
    await this.props.loadPortfolio();
  }

  render() {
    const { portfolio } = this.props;
    return (
      <div className="columns">
        <div className="column is-half">
          <h2 className="is-size-2">
            <u>PORTFOLIO</u>
          </h2>
          <br />
          {portfolio && portfolio.length ? (
            portfolio.map((item, idx) => (
              <div
                key={idx}
                className={
                  item.change === "positive"
                    ? "has-text-success"
                    : item.change === "negative"
                    ? "has-text-danger"
                    : "has-text-dark"
                }
              >
                {item.symbol} - {item.quantity} Shares - {item.currentValue}
                <hr />
              </div>
            ))
          ) : (
            <div>Loading Portfolio. Please wait!</div>
          )}
        </div>
        <StockForm />
      </div>
    );
  }
}

const mapState = state => ({
  portfolio: state.portfolio
});

const mapDispatch = dispatch => ({
  loadPortfolio: () => dispatch(getPortfolio())
});

export default connect(
  mapState,
  mapDispatch
)(Portfolio);
