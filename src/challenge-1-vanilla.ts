// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx

import { initialState, ACTIONS } from "./constants";
import { getFilteredCharacters, fetchAllData, calculatePower } from "./utils";
import { UIState, CharacterType, PubSub } from "./types";

//let state = initialState;

const selectors = {
  getTableBody() {
    return document.getElementById("tbody");
  },
  getMultiplierInput() {
    return <HTMLInputElement>document.getElementById("multiplier");
  },
  getFilterInput() {
    return <HTMLInputElement>document.getElementById("filter");
  },
  getContainer() {
    return document.getElementById("vanilla");
  },
};

function PubSub() {
  //array of functions submitted via the store
  const subscribers: { [key: string]: Array<Function> } = {};

  function subscribe(event: string, callbacks: Function[]) {
    //check if event is already in the array
    if (!subscribers[event]) {
      subscribers[event] = [];
    }
    //if event not in the array add it
    subscribers[event] = [...subscribers[event], ...callbacks];
  }

  //remove completed functions from the array
  function unsubscribe(event: string, callback: Function) {
    subscribers[event] = subscribers[event].filter((cback: Function) => {
      return cback != callback;
    });
  }

  function publish(event: string, state: UIState) {
    if (!subscribers[event]) {
      return;
    }

    subscribers[event].forEach((callback) => {
      callback(state);
    });
  }

  return {
    subscribe,
    unsubscribe,
    publish,
  };
}

function Store(pubSub: PubSub) {
  //set initial state
  let state: UIState = initialState;

  function initializeState(characters: CharacterType[]) {
    state = {
      ...state,
      filteredCharacters: getFilteredCharacters({
        characters,
        query: state.query,
      }),
    };
    pubSub.publish(ACTIONS.STATE_INITIALIZED, state);
  }

  function updateState({
    characters,
    query,
    multiplier,
  }: {
    characters: CharacterType[];
    query?: string;
    multiplier?: number;
  }) {
    if (typeof query === "string") {
      state = {
        ...state,
        query,
        filteredCharacters: getFilteredCharacters({
          characters,
          query,
        }),
      };

      pubSub.publish(ACTIONS.NAME_CHANGED, state);
    }

    if (multiplier) {
      state = {
        ...state,
        multiplier,
      };
      pubSub.publish(ACTIONS.MULTIPLIER_CHANGED, state);
    }
  }

  function resetState({ characters }: { characters: CharacterType[] }) {
    const { query } = initialState;

    state = {
      ...initialState,
      filteredCharacters: getFilteredCharacters({
        characters,
        query,
      }),
    };
    pubSub.publish(ACTIONS.STATE_INITIALIZED, state);
  }

  return {
    initializeState,
    updateState,
    resetState,
  };
}

function Renderer() {
  function renderRows(state: UIState) {
    const tbody = selectors.getTableBody(); //get table body
    // remove any present rows before rendering

    if (tbody.firstChild) {
      removeRows();
    }

    state.filteredCharacters.forEach((character) => {
      const row = document.createElement("tr");
      const name = document.createElement("td");
      const height = document.createElement("td");
      const mass = document.createElement("td");
      const power = document.createElement("td");

      name.innerText = character.name;
      height.innerText = character.height;
      mass.innerText = character.mass;
      power.textContent = calculatePower(character, state.multiplier);

      row.append(name, height, mass, power);
      tbody.appendChild(row);
    });
  }

  function removeRows() {
    const tbody = selectors.getTableBody();
    //remove all children if first child not empty
    while (tbody.firstChild) {
      tbody.firstChild.remove();
    }
  }

  function updateInputValues(state: UIState) {
    selectors.getFilterInput().value = state.query;
    selectors.getMultiplierInput().value = state.multiplier.toString();
  }
  return {
    renderRows,
    removeRows,
    updateInputValues,
  };
}

export async function runVanillaApp() {
  /*************** fetch data ***************************/
  const pubSub = PubSub();
  const store = Store(pubSub);
  const renderer = Renderer();

  /**** define all subscribers *****/
  pubSub.subscribe(ACTIONS.STATE_INITIALIZED, [
    renderer.renderRows,
    renderer.updateInputValues,
  ]);

  pubSub.subscribe(ACTIONS.NAME_CHANGED, [
    renderer.renderRows,
    renderer.updateInputValues,
  ]);

  pubSub.subscribe(ACTIONS.MULTIPLIER_CHANGED, [
    renderer.removeRows,
    renderer.renderRows,
  ]);

  /** Clean up all references in memory */
  selectors.getContainer()?.addEventListener("unload", function () {
    pubSub.unsubscribe(ACTIONS.STATE_INITIALIZED, renderer.renderRows);
    pubSub.unsubscribe(ACTIONS.STATE_INITIALIZED, renderer.updateInputValues);
    pubSub.unsubscribe(ACTIONS.NAME_CHANGED, renderer.updateInputValues);
    pubSub.unsubscribe(ACTIONS.MULTIPLIER_CHANGED, renderer.removeRows);
    pubSub.unsubscribe(ACTIONS.MULTIPLIER_CHANGED, renderer.renderRows);
  });

  //get data
  const characters = await fetchAllData();

  store.initializeState(characters);

  // /***************************  Event listeners **************************************************************************/
  selectors.getMultiplierInput().addEventListener("change", (e) => {
    store.updateState({
      characters,
      multiplier: Number((e.target as HTMLInputElement).value),
    });
  });

  selectors.getFilterInput().addEventListener("input", (e) => {
    store.updateState({
      characters,
      query: (e.target as HTMLInputElement).value,
    });
  });

  function escapeKeyHandler(e: { code: string }) {
    if (e.code === "Escape") {
      store.resetState({ characters });
    }
  }

  selectors.getContainer().addEventListener("keydown", escapeKeyHandler);
}
