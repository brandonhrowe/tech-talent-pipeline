import axios from "axios";
import { subtractFromBalance } from "./user";
import { getError, resetError } from "./error";

const defaultPortfolio = { list: [], total: 0 };

const SET_PORTFOLIO = "SET_PORTFOLIO";
const ADD_TO_PORTFOLIO = "ADD_TO_PORTFOLIO";

const setPortfolio = portfolio => ({ portfolio, type: SET_PORTFOLIO });
const addToPortfolio = item => ({ item, type: ADD_TO_PORTFOLIO });

export const getPortfolio = () => async dispatch => {
  try {
    dispatch(resetError());
    const { data } = await axios.get("/api/transaction/portfolio");
    dispatch(setPortfolio(data));
  } catch (error) {
    console.log(error);
    dispatch(getError(error.response.data));
  }
};

export const createPortfolioAction = item => async dispatch => {
  try {
    dispatch(resetError());
    const { symbol, quantity } = item;
    const { data: newItem } = await axios.post("/api/transaction", {
      symbol,
      quantity
    });
    dispatch(addToPortfolio(newItem));
    dispatch(subtractFromBalance(newItem.quantity * newItem.originalPrice));
  } catch (error) {
    console.log(error);
    dispatch(getError(error.response.data));
  }
};

export default function(state = defaultPortfolio, action) {
  switch (action.type) {
    case SET_PORTFOLIO:
      let keys = Object.keys(action.portfolio);
      return {
        list: action.portfolio,
        total: keys.reduce(
          (acc, curr) =>
            (acc +=
              action.portfolio[curr].quantity *
              action.portfolio[curr].currentValue),
          0
        )
      };
    case ADD_TO_PORTFOLIO:
      return {
        list: {
          ...state.list,
          [action.item.symbol]: {
            ...action.item,
            currentValue: action.item.originalPrice,
            change: action.item.originalChange,
            quantity: !state.list[action.item.symbol]
              ? action.item.quantity
              : action.item.quantity + state.list[action.item.symbol].quantity
          }
        },
        total: state.total + action.item.quantity * action.item.originalPrice
      };
    default:
      return state;
  }
}
