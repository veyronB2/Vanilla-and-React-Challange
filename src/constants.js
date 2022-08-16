//define initial states for the application
export const initialState = {
  filteredCharacters: [],
  multiplier: 10,
  query: "",
};

//define all actions
export const ACTIONS = {
  QUERY: "query",
  MULTIPLIER: "multiplier",
  FETCH: "fetchComplete",
  RESET: "resetState",
};
