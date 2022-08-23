// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx

import { initialState } from "./constants";
import { getFilteredCharacters, fetchAllData, calculatePower } from "./utils";

let state = initialState;

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

function renderRows() {
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
    row.append(name, height, mass, power);
    tbody.appendChild(row);
  });
  //update power column once rows have been updated
  updatePowerColumn();
}

function initializeState(characters) {
  state = {
    ...state,
    filteredCharacters: getFilteredCharacters({
      characters,
      query: state.query,
    }),
  };
  renderRows();
}

function updatePowerColumn() {
  const rows = selectors.getTableBody().children;

  //go through each row and update the power column
  state.filteredCharacters.forEach((character, index) => {
    const powerCol = rows[index].children[3];
    powerCol.textContent = calculatePower(character, state.multiplier);
  });
}

function removeRows() {
  const tbody = selectors.getTableBody();
  //remove all children if first child not empty
  while (tbody.firstChild) {
    tbody.firstChild.remove();
  }
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

function updateTableRows() {
  removeRows();
  renderRows();
}

function resetState(characters) {
  const { query } = initialState;
  console.log(`Query:${query}`);

  state = {
    ...initialState,
    filteredCharacters: getFilteredCharacters({
      characters,
      query,
    }),
  };
  updateInputValues();
  updateTableRows();
}

function updateInputValues() {
  selectors.getFilterInput().value = state.query;
  selectors.getMultiplierInput().value = state.multiplier;
}

export async function runVanillaApp() {
  /*************** fetch data ***************************/
  const characters = await fetchAllData();

  //update state with fetched info
  initializeState(characters);

  // /***************************  Event listeners **************************************************************************/
  selectors.getMultiplierInput().addEventListener("change", (e) => {
    updateState({ characters, multiplier: Number(e.target.value) });
    updateTableRows();
  });

  selectors.getFilterInput().addEventListener("input", (e) => {
    updateState({ characters, query: e.target.value });
    updateTableRows();
  });

  selectors.getContainer().addEventListener("keydown", escapeKeyHandler);

  function escapeKeyHandler(e) {
    if (e.code === "Escape") {
      resetState(characters);
    }
  }
}
