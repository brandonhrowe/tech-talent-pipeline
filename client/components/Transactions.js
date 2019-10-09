import React, { Component } from "react";
import { connect } from "react-redux";
import { getTransactions } from "../store";
import { decimalCleaner } from "../utils";
import StockForm from "./StockForm";

class Transactions extends Component {
  async componentDidMount() {
    await this.props.loadTransactions();
  }

  render() {
    const { actions } = this.props;
    return (
      <div className="column is-two-thirds box columns is-centered">
        <div className="column is-half">
          <h2 className="is-size-2">
            <u>TRANSACTIONS</u>
          </h2>
          <br />
          {actions && actions.length ? (
            actions.map((action, idx) => (
              <div key={idx} className="has-text-weight-semibold has-text-left has-text-centered-mobile">
                BUY ({action.symbol}) - {action.quantity} @{" "}
                {decimalCleaner(action.originalPrice)}
                <hr />
              </div>
            ))
          ) : (
            <div>No transactions right now</div>
          )}
        </div>
        <StockForm />
      </div>
    );
  }
}

const mapState = state => ({
  actions: state.transaction
});

const mapDispatch = dispatch => ({
  loadTransactions: () => dispatch(getTransactions())
});

export default connect(
  mapState,
  mapDispatch
)(Transactions);
