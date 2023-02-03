import {
  ADD_TO_HISTORY,
  REMOVE_ALL_HISTORY,
  REMOVE_FROM_HISTORY,
} from "../constants/searchConstants";

export const searchHistoryReducer = (
  state = { searchHistories: [] },
  action
) => {
  let histories = [];
  switch (action.type) {
    case ADD_TO_HISTORY:
      const isExist = state.searchHistories.find(
        (history) =>
          history.search.toLowerCase() === action.payload.search.toLowerCase()
      );

      // if exist just put on the top
      if (isExist) {
        histories = [
          action.payload,
          ...state.searchHistories.filter(
            (history) =>
              history.search.toLowerCase() !==
              action.payload.search.toLowerCase()
          ),
        ];
      } else {
        histories = [action.payload, ...state.searchHistories];
      }

      localStorage.setItem("test_search_history", JSON.stringify(histories));
      return {
        searchHistories: histories,
      };
    case REMOVE_FROM_HISTORY:
      histories = state.searchHistories.filter(
        (history) => history.key !== action.payload
      );
      localStorage.setItem("test_search_history", JSON.stringify(histories));
      return {
        searchHistories: histories,
      };
    case REMOVE_ALL_HISTORY:
      localStorage.removeItem("test_search_history");
      return {
        searchHistories: [],
      };
    default:
      return state;
  }
};
