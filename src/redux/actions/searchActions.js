import {
  ADD_TO_HISTORY,
  REMOVE_ALL_HISTORY,
  REMOVE_FROM_HISTORY,
} from "../constants/searchConstants";

export const addToHistory = (search) => (dispatch) => {
  dispatch({ type: ADD_TO_HISTORY, payload: search });
};

export const removeFromHistory = (id) => (dispatch) => {
  dispatch({ type: REMOVE_FROM_HISTORY, payload: id });
};

export const removeAllHistory = (id) => (dispatch) => {
  dispatch({ type: REMOVE_ALL_HISTORY });
};
