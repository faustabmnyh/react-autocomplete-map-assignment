import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { searchHistoryReducer } from "./redux/reducers/searchReducers";

const initalState = {
  searchHistory: {
    searchHistories: localStorage.getItem("test_search_history")
      ? JSON.parse(localStorage.getItem("test_search_history"))
      : [],
  },
};

const reducer = combineReducers({
  searchHistory: searchHistoryReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  initalState,
  composeEnhancer(applyMiddleware(thunk))
);

export default store;
