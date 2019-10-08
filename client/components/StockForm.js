import React, { Component } from "react";
import { connect } from "react-redux";
import { createTransaction } from "../store";
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
      suggestions: [],
      errors: {}
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
      const { data } = await axios.get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${text}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
      );
      this.setState({
        suggestions: data.bestMatches
      });
    }
  }

  render() {
    const { fields, suggestions } = this.state;
    const { user, handleTransactionAdd } = this.props;
    return (
      <div className="column is-one-third">
        <div className="is-size-2">Cash: ${decimalCleaner(user.balance)}</div>
        <form
          className="form"
          onSubmit={handleTransactionAdd}
          onChange={this.handleSuggestion}
        >
          {fields.map(({ name, type, placeholder }, i) => {
            return this.renderInput(
              name,
              type,
              placeholder,
              i
              // this.handleSuggestion
            );
          })}
          <div>
            <button className="button is-success" type="submit">
              Buy
            </button>
          </div>
        </form>
        {suggestions.length
          ? suggestions.map((sug, idx) => (
              <div key={idx}>
                Symbol: {sug["1. symbol"]}, Name: {sug["2. name"]}
              </div>
            ))
          : null}
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
  }
});

export default connect(
  mapState,
  mapDispatch
)(StockForm);
