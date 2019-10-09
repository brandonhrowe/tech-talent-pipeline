import React, { Component } from "react";
import { connect } from "react-redux";
import { getPortfolio } from "../store";
import { decimalCleaner } from "../utils";
import StockForm from "./StockForm";

class Portfolio extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    await this.props.loadPortfolio();
    this.setState({ isLoading: false });
  }

  render() {
    const { portfolio, total } = this.props;
    const { isLoading } = this.state;
    const keys = Object.keys(portfolio);
    console.log(portfolio);
    return (
      <div className="columns is-centered">
        <div className="column is-one-third">
          <h2 className="is-size-2">
            <u>PORTFOLIO (${decimalCleaner(total)})</u>
          </h2>
          <br />
          {isLoading ? (
            <div>Loading Portfolio. Please wait!</div>
          ) : portfolio && keys.length ? (
            keys.map((item, idx) => (
              <div
                key={idx}
                className={`columns is-centered ${
                  portfolio[item].change === "positive"
                    ? "has-text-success"
                    : portfolio[item].change === "negative"
                    ? "has-text-danger"
                    : "has-text-dark"
                }`}
              >
                <div className="column">
                  {portfolio[item].symbol} - {portfolio[item].quantity} Shares
                </div>
                <div className="column">
                  ${decimalCleaner(portfolio[item].currentValue)}/Share
                </div>
                <hr />
              </div>
            ))
          ) : (
            <div>
              It looks like there is nothing in your transaction history
            </div>
          )}
        </div>
        <StockForm />
      </div>
    );
  }
}

const mapState = state => ({
  portfolio: state.portfolio.list,
  total: state.portfolio.total
});

const mapDispatch = dispatch => ({
  loadPortfolio: () => dispatch(getPortfolio())
});

export default connect(
  mapState,
  mapDispatch
)(Portfolio);
