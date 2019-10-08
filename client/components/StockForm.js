import React, { Component } from "react";
import { connect } from "react-redux";
import { createTransaction } from "../store";
import { decimalCleaner, renderInput } from "../utils";

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
      errors: {}
    };
    this.renderInput = renderInput.bind(this);
  }

  render() {
    const { fields } = this.state;
    const { user, handleTransactionAdd } = this.props;
    return (
      <div className="column is-one-third">
        <div className="is-size-2">Cash: ${decimalCleaner(user.balance)}</div>
        <form className="form" onSubmit={handleTransactionAdd}>
          {fields.map(({ name, type, placeholder }, i) => {
            return this.renderInput(name, type, placeholder, i);
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
  }
});

export default connect(
  mapState,
  mapDispatch
)(StockForm);
