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
          ) : portfolio && portfolio.length ? (
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
                {item.symbol} - {item.quantity} Shares -{" "}
                {decimalCleaner(item.currentValue)}
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
