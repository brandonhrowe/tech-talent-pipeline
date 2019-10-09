const defaultError = "";

const SET_ERROR = "SET_ERROR";
const CLEAR_ERROR = "CLEAR_ERROR";

const setError = error => ({ error, type: SET_ERROR });
const clearError = () => ({ type: CLEAR_ERROR });

export const getError = err => dispatch => {
  return dispatch(setError(err));
};

export const resetError = () => dispatch => {
  return dispatch(clearError());
};

export default function(state = defaultError, action) {
  switch (action.type) {
    case SET_ERROR:
      return action.error;
    case CLEAR_ERROR:
      return defaultError;
    default:
      return state;
  }
}
