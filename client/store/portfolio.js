import axios from "axios";
import { subtractFromBalance } from "./user";

const defaultPortfolio = { list: [], total: 0 };

const SET_PORTFOLIO = "SET_PORTFOLIO";
const ADD_TO_PORTFOLIO = "ADD_TO_PORTFOLIO";

const setPortfolio = portfolio => ({ portfolio, type: SET_PORTFOLIO });
const addToPortfolio = item => ({ item, type: ADD_TO_PORTFOLIO });

export const getPortfolio = () => async dispatch => {
  try {
    const { data } = await axios.get("/api/transaction/portfolio");
    dispatch(setPortfolio(data));
  } catch (error) {
    console.log(error);
  }
};

export const createPortfolioAction = item => async dispatch => {
  try {
    const { symbol, quantity } = item;
    const { data: newItem } = await axios.post("/api/transaction", {
      symbol,
      quantity
    });
    dispatch(addToPortfolio(newItem));
    dispatch(subtractFromBalance(newItem.quantity * newItem.originalPrice));
  } catch (error) {
    console.log(error);
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
            quantity:
              action.item.quantity + state.list[action.item.symbol].quantity
          }
        },
        total: state.total + action.item.quantity * action.item.originalPrice
      };
    default:
      return state;
  }
}
