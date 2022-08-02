// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx
export function runVanillaApp() {
  //get DOM objects
  const tbody = document.getElementById("tbody");
  const multiplierDropDown = document.getElementById("multiplier");
  const filterInput = document.getElementById("filter");

  //define variables
  let url = "https://swapi.dev/api/people/";
  const data = [];
  let multiplier = multiplierDropDown.value; // initial value
  let filter = ""; //default value

  /*************** data fetching section ***************************/
  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      const people = await response.json();
      data.push(...people.results);

      const nextPage = people.next;

      if (nextPage === null) {
        return data;
      }
      return await fetchData(nextPage);
    } catch (error) {
      console.log(error);
    }
  };

  /*************** calculate power  ************************************/
  const calcPower = (mass, height, multiplier) => {
    if (isNaN(mass) || isNaN(height)) {
      return "-";
    }
    const power =
      parseFloat(mass) * parseFloat(height) * parseFloat(multiplier);

    return power.toFixed(0);
  };

  /* wait for fetch to complete before building the table  */
  async function buidltable() {
    await fetchData(url);

    /* build dynamic table based on data fetched */
    data.forEach((user, index) => {
      const row = document.createElement("tr");
      const name = document.createElement("td");

      name.innerText = user.name;
      name.id = index.toString();
      const height = document.createElement("td");
      height.innerText = user.height;
      const mass = document.createElement("td");
      mass.innerText = user.mass;
      const power = document.createElement("td");
      power.innerText = calcPower(user.mass, user.height, multiplier);
      power.id = `power${index}`;

      row.append(name, height, mass, power);
      tbody.appendChild(row);
    });
  }

  //update power column
  function updatePower(multiplier) {
    data.forEach((item, index) => {
      const power = document.getElementById(`power${index}`);
      power.innerText = calcPower(item.mass, item.height, multiplier);
    });
  }

  function filterName(event) {
    const keys = ["name"];
    filter = filterInput.value;
    data
      .filter((item) =>
        keys.some((key) => item[key].toLowerCase().includes(filter))
      )
      .map((person, index) => {
        const rows = document.getElementsByTagName("tr");
      });
  }

  /* create all even listeners */
  multiplierDropDown.addEventListener("change", (e) => {
    multiplier = e.target.value;
    updatePower(multiplier);
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      multiplier = 10;
      filter = "";
      multiplierDropDown.value = multiplier;
      filterInput.value = filter;
      updatePower(multiplier);
    }
  });

  filterInput.addEventListener("input", (e) => {
    filterName(e);
  });

  buidltable();
}
