import axios from "axios";

const defaultTransactions = [];

const SET_TRANSACTIONS = "SET_TRANSACTIONS";
const ADD_TRANSACTION = "ADD_TRANSACTION";

const setTransactions = actions => ({ actions, type: SET_TRANSACTIONS });
const addTransaction = action => ({ action, type: ADD_TRANSACTION });

export const getTransactions = actions => async dispatch => {
  try {
    const { data } = await axios.get("/api/transaction");
    dispatch(setTransactions(data));
  } catch (error) {
    console.log(error);
  }
};

export const createTransaction = action => async dispatch => {
  try {
    const { symbol, quantity } = action;
    const newAction = await axios.post("/api/transaction", {
      symbol,
      quantity
    });
    dispatch(addTransaction(newAction));
  } catch (error) {
    console.log(error);
  }
};

export default function(state = defaultTransactions, action) {
  switch (action.type) {
    case SET_TRANSACTIONS:
      return action.actions;
    case ADD_TRANSACTION:
      return [...state, action.action];
    default:
      return state;
  }
}
