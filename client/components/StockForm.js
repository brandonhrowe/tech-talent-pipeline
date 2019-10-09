import React, { Component } from "react";
import { connect } from "react-redux";
import { createPortfolioAction, createTransaction } from "../store";
import { decimalCleaner, renderInput } from "../utils";
import axios from "axios";

class StockForm extends Component {
  constructor() {
    super();
    this.state = {
      fields: [
        {
          name: "symbol",
          type: "text",
          placeholder: "Ticker"
        },
        {
          name: "quantity",
          type: "integer",
          placeholder: "Qty"
        }
      ],
      suggestions: []
    };
    this.renderInput = renderInput.bind(this);
    this.handleSuggestion = this.handleSuggestion.bind(this);
  }

  async handleSuggestion(e) {
    this.setState({
      suggestions: []
    });
    if (e.target.name === "symbol" && e.target.value) {
      const text = e.target.value;
      const { data } = await axios.get(`/api/suggestions/${text}`);
      this.setState({
        suggestions: data.bestMatches
      });
    }
  }

  render() {
    const { fields, suggestions } = this.state;
    const { user, handleTransactionAdd, handlePortfolioAdd, page } = this.props;
    return (
      <div id="stock-form" className="column is-half">
        <div className="is-size-2">Cash: ${decimalCleaner(user.balance)}</div>
        <form
          className="form"
          onSubmit={
            page === "portfolio" ? handlePortfolioAdd : handleTransactionAdd
          }
          onChange={this.handleSuggestion}
        >
          {fields.map(({ name, type, placeholder }, i) => {
            return this.renderInput(name, type, placeholder, i, suggestions);
          })}
          <div>
            <button className="button is-success" type="submit">
              Buy
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapState = state => ({
  user: state.user
});

const mapDispatch = dispatch => ({
  handleTransactionAdd: e => {
    e.preventDefault();
    const { symbol, quantity } = e.target;
    const values = {
      symbol: symbol.value,
      quantity: quantity.value
    };
    dispatch(createTransaction(values));
  },
  handlePortfolioAdd: e => {
    e.preventDefault();
    const { symbol, quantity } = e.target;
    const values = {
      symbol: symbol.value,
      quantity: quantity.value
    };
    dispatch(createPortfolioAction(values));
  }
});

export default connect(
  mapState,
  mapDispatch
)(StockForm);
