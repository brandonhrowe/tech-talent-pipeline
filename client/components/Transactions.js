import React, { Component } from "react";
import { connect } from "react-redux";
import { getTransactions } from "../store";
import { decimalCleaner } from "../utils";

class Transactions extends Component {
  async componentDidMount() {
    await this.props.loadTransactions();
  }

  render() {
    const { actions } = this.props;
    return (
      <div className="columns">
        <div className="column is-half">
          <h2 className="is-size-2">
            <u>TRANSACTIONS</u>
          </h2>
          <br />
          {actions && actions.length ? (
            actions.map(action => (
              <div key={action.id}>
                BUY ({action.symbol}) - {action.quantity} @{" "}
                {decimalCleaner(action.originalPrice)}
                <hr />
              </div>
            ))
          ) : (
            <div>No transactions right now</div>
          )}
        </div>
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
