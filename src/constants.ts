//define initial states for the application
import { UIState } from "./types";

export const initialState: UIState = {
  filteredCharacters: [],
  multiplier: 10,
  query: "",
};

//define all actions
export enum ACTIONSReact {
  QUERY = "query",
  MULTIPLIER = "multiplier",
  FETCH = "fetchComplete",
  RESET = "resetState",
}

export enum ACTIONS {
  CHARACTERS_FETCHED = "characters fetched",
  STATE_INITIALIZED = "state initialized",
  NAME_CHANGED = "name changed",
  MULTIPLIER_CHANGED = "multiplier changed",
  ESC_KEY_PRESSED = "escape key pressed",
}

//
