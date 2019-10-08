import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import user from "./user";
import transaction from "./transaction";
import portfolio from "./portfolio";

const reducer = combineReducers({ user, transaction, portfolio });

const middleware = applyMiddleware(thunkMiddleware);

const store = createStore(reducer, middleware);

export default store;
export * from "./user";
export * from "./transaction";
export * from "./portfolio";
