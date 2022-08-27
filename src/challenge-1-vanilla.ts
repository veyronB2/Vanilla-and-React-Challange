// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx

import { initialState } from "./constants";
import { getFilteredCharacters, fetchAllData, calculatePower } from "./utils";

//let state = initialState;

const selectors = {
  getTableBody() {
    return document.getElementById("tbody");
  },
  getMultiplierInput() {
    return document.getElementById("multiplier");
  },
  getFilterInput() {
    return document.getElementById("filter");
  },
  getContainer() {
    return document.getElementById("vanilla");
  },
};

function stateControl() {
  let state = initialState;
  function initializeState(characters) {
    state = {
      ...state,
      filteredCharacters: getFilteredCharacters({
        characters,
        query: state.query,
      }),
    };
  }

  function updateState({ characters, query, multiplier }) {
    if (typeof query === "string") {
      state = {
        ...state,
        query,
        filteredCharacters: getFilteredCharacters({
          characters,
          query,
        }),
      };
    }

    if (multiplier) {
      state = {
        ...state,
        multiplier,
      };
    }
  }

  function resetState(characters) {
    const { query } = initialState;

    state = {
      ...initialState,
      filteredCharacters: getFilteredCharacters({
        characters,
        query,
      }),
    };
    Renderer().updateInputValues(state);
    Renderer().removeRows();
    Renderer().renderRows(state);
  }

  function getState() {
    return state;
  }
  return {
    initializeState,
    updateState,
    resetState,
    getState,
  };
}

function Renderer() {
  function renderRows(state) {
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

  function updateInputValues(state) {
    selectors.getFilterInput().value = state.query;
    selectors.getMultiplierInput().value = state.multiplier;
  }
  return {
    renderRows,
    removeRows,
    // updateTableRows,
    updateInputValues,
  };
}

export async function runVanillaApp() {
  /*************** fetch data ***************************/
  const characters = await fetchAllData();
  const setState = stateControl();
  const renderer = Renderer();

  //update state with fetched info
  setState.initializeState(characters);

  //render table rows
  renderer.renderRows(setState.getState());

  // /***************************  Event listeners **************************************************************************/
  selectors.getMultiplierInput().addEventListener("change", (e) => {
    setState.updateState({
      characters,
      multiplier: Number(e.target.value),
    });
    renderer.removeRows();
    renderer.renderRows(setState.getState());
  });

  selectors.getFilterInput().addEventListener("input", (e) => {
    setState.updateState({ characters, query: e.target.value });
    renderer.removeRows();
    renderer.renderRows(setState.getState());
  });

  function escapeKeyHandler(e) {
    if (e.code === "Escape") {
      setState.resetState(characters);
    }
  }
  selectors.getContainer().addEventListener("keydown", escapeKeyHandler);
}
