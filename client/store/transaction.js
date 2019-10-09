import axios from "axios";
import { subtractFromBalance } from "./user";
import { getError, resetError } from "./error";

const defaultTransactions = [];

const SET_TRANSACTIONS = "SET_TRANSACTIONS";
const ADD_TRANSACTION = "ADD_TRANSACTION";

const setTransactions = actions => ({ actions, type: SET_TRANSACTIONS });
const addTransaction = action => ({ action, type: ADD_TRANSACTION });

export const getTransactions = () => async dispatch => {
  try {
    dispatch(resetError());
    const { data } = await axios.get("/api/transaction");
    dispatch(setTransactions(data));
  } catch (error) {
    console.log(error);
    dispatch(getError(error.respose.data));
  }
};

export const createTransaction = action => async dispatch => {
  try {
    dispatch(resetError());
    const { symbol, quantity } = action;
    const { data: newAction } = await axios.post("/api/transaction", {
      symbol,
      quantity
    });
    dispatch(addTransaction(newAction));
    dispatch(subtractFromBalance(newAction.quantity * newAction.originalPrice));
  } catch (error) {
    console.log(error);
    dispatch(getError(error.response.data));
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
