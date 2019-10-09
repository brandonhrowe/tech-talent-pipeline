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
    this.reloadPage = this.reloadPage.bind(this);
  }

  async componentDidMount() {
    await this.props.loadPortfolio();
    this.setState({ isLoading: false });
  }

  async reloadPage() {
    this.setState({ isLoading: true });
    await this.props.loadPortfolio();
    this.setState({ isLoading: false });
  }

  render() {
    const { portfolio, total } = this.props;
    const { isLoading } = this.state;
    const keys = Object.keys(portfolio);
    return (
      <div className="column is-two-thirds box columns is-centered">
        <div className="column is-half">
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
                className={`columns is-centered has-text-weight-semibold is-size-4 portfolio-entries ${
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
          {!isLoading ? (
            <button
              className="button is-success"
              type="button"
              onClick={this.reloadPage}
            >
              Refresh
            </button>
          ) : null}
        </div>
        <StockForm page="portfolio" />
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
