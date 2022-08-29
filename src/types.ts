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
