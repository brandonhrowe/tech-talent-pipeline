import React, { Component } from "react";
import { connect } from "react-redux";
import { getTransactions } from "../store";

class Transactions extends Component {
  async componentDidMount() {
    await this.props.loadTransactions();
  }

  render() {
    const { actions } = this.props;
    return (
      <div>
        {actions.length ? (
          actions.map(action => <li key={action.id}>action.name</li>)
        ) : (
          <div>No transactions right now</div>
        )}
      </div>
    );
  }
}

const mapState = state => ({
  actions: state.actions
});

const mapDispatch = dispatch => ({
  loadTransactions: () => dispatch(getTransactions())
});

export default connect(
  mapState,
  mapDispatch
)(Transactions);
