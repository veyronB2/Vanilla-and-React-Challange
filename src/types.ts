import { ACTIONSReact } from "./constants";

export type UIState = {
  query: string;
  filteredCharacters: CharacterType[];
  multiplier: number;
};

export type CharacterType = {
  name: string;
  height: string;
  mass: string;
};

export type PubSub = {
  subscribe: Function;
  unsubscribe: Function;
  publish: Function;
};

export type Action = {
  type: ACTIONSReact;
  payload: Payload;
};

export type Payload = {
  characters?: CharacterType[];
  query?: string;
  multiplier?: number;
};
