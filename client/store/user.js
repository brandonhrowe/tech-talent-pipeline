import axios from "axios";
import { getError } from "./error";

const defaultUser = {};

const GET_USER = "GET_USER";
const REMOVE_USER = "REMOVE_USER";
const REMOVE_FROM_BALANCE = "REMOVE_FROM_BALANCE";

const getUser = user => ({ type: GET_USER, user });
const removeUser = () => ({ type: REMOVE_USER });
const removeFromBalance = cost => ({ type: REMOVE_FROM_BALANCE, cost });

export const currUser = () => async dispatch => {
  try {
    const res = await axios.get("/api/user/auth");
    dispatch(getUser(res.data || defaultUser));
  } catch (err) {
    console.error(err);
  }
};

export const login = ({ email, password, history }) => async dispatch => {
  let res;
  try {
    res = await axios.post(`/api/user/login`, {
      email,
      password
    });
  } catch (authError) {
    return dispatch(getError(authError.response.data));
  }

  try {
    dispatch(getUser(res.data));
    history.push("/portfolio");
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr);
  }
};

export const signup = ({
  email,
  password,
  name,
  history
}) => async dispatch => {
  let res;
  try {
    res = await axios.post(`/api/user/signup`, {
      name,
      email,
      password
    });
  } catch (authError) {
    return dispatch(getUser({ error: authError }));
  }

  try {
    dispatch(getUser(res.data));
    history.push("/portfolio");
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr);
  }
};

export const clearError = () => dispatch => {
  return dispatch(getUser({ error: "" }));
};

export const logout = () => async dispatch => {
  try {
    await axios.post("/api/user/logout");
    dispatch(removeUser());
  } catch (err) {
    console.error(err);
  }
};

export const subtractFromBalance = cost => dispatch => {
  return dispatch(removeFromBalance(cost));
};

export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case REMOVE_USER:
      return defaultUser;
    case REMOVE_FROM_BALANCE:
      return { ...state, balance: state.balance - action.cost };
    default:
      return state;
  }
}
