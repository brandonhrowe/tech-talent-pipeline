import axios from "axios";

const defaultPortfolio = [];

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
    const newItem = await axios.post("/api/transaction", {
      symbol,
      quantity
    });
    dispatch(addToPortfolio(newItem));
  } catch (error) {
    console.log(error);
  }
};

export default function(state = defaultPortfolio, action) {
  switch (action.type) {
    case SET_PORTFOLIO:
      return action.portfolio;
    case ADD_TO_PORTFOLIO:
      return [...state, action.item];
    default:
      return state;
  }
}
