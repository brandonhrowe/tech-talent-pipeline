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
          type: "text"
        },
        {
          name: "quantity",
          type: "integer"
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
      <div>
        <div>Cash: ${decimalCleaner(user.balance)}</div>
        <form
          className="form"
          onSubmit={handleTransactionAdd}
        >
          {fields.map(({ name, type }, i) => {
            return this.renderInput(name, type, i);
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
});

export default connect(
  mapState,
  mapDispatch
)(StockForm);
