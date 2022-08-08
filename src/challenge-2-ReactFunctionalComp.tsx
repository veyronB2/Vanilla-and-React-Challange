import { useEffect, useReducer } from "react";
let url = "https://swapi.dev/api/people/";

//define initial states for the application 
const initialState = {
  characters: [],
  multiplier: 10,
  query: "",
}

//define all actions
const ACTIONS = {
  QUERY: "query",
  MULTIPLIER: "multiplier",
  FETCH: "fetchComplete",
  RESET: "resetState"
}

const reducer = (state, action) => {

  const map: { [key: string]: Function } = {
    [ACTIONS.FETCH]: fetchCharacters,
    [ACTIONS.MULTIPLIER]: updatePower,
    [ACTIONS.QUERY]: nameFilter,
    [ACTIONS.RESET]: resetState,
  }

  return map[action.type] ? map[action.type]() : state

  function nameFilter() {
    return { ...state, query: action.payload }
  }

  function updatePower() {
    return { ...state, multiplier: action.payload }
  }

  function fetchCharacters() {
    return { ...state, characters: action.payload };
  }

  function resetState() {

  }

}

function FunctionalComp() {

  const [state, dispatch] = useReducer(reducer, initialState);
  const { characters, multiplier, query } = state;


  /*** fetch data ***/
  const fetchPeople = async (url: string, pages = []) => {
    try {
      const response = await fetch(url);
      const people = await response.json();
      pages.push(...people.results); //update array with results

      //get url of the next page 
      const nextPage = people.next;


      if (!nextPage) {
        dispatch({ type: ACTIONS.FETCH, payload: pages })
        //setCharacters(pages);// if last page, update the state with final total result
        return;
      }
      return await fetchPeople(nextPage, pages)  //recursive data fetching by calling itself and passing variables
    } catch (error) {
      console.log(error);
    }
  }

  /*** call fetch data on initial render***/
  useEffect(() => {
    fetchPeople(url);
  }, []);

  /* calculate power based on values passed  */
  function calculatePower(height: number, mass: number) {

    //make sure NaN is not shown 
    if (isNaN(mass) || isNaN(height)) {
      return "-";
    }
    //return final power
    return (height * mass * state.multiplier).toFixed(0); //remove decimal could round it up or down as well 
  }

  //filter keys. More can be added if needed to filter on all columns 
  const keys = ["name"];

  //handle escape key press
  useEffect(() => {
    const handleEsc = (event) => {
      //reset to defaults
      if (event.key === "Escape") {
        dispatch({ type: ACTIONS.MULTIPLIER, payload: multiplier })
        dispatch({ type: ACTIONS.QUERY, payload: query })
      }

    };
    window.addEventListener('keydown', handleEsc);

    //remove event listener to avoid memory leaks etc 
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (



    <div id="functional-comp">
      <h2>React Functional Component</h2>

      Filter: <input value={query} placeholder="Filter by name" onChange={(e) => dispatch({ type: ACTIONS.QUERY, payload: e.target.value })} /> Multiplier:{" "}
      <input
        id="functional-multiplier"
        placeholder="Multiplier"
        type="number"
        min="1"
        max="20"
        value={multiplier}
        onChange={(e) => dispatch({ type: ACTIONS.MULTIPLIER, payload: e.target.value })}
      />{" "}
      Press "Escape" to reset fields
      <div className="loader">Loading...</div>
      <table width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Mass</th>
            <th>Power</th>

          </tr>
        </thead>
        {characters.filter(item => keys.some(key => item[key].toLowerCase().includes(query))).map((person, index) => {
          return (

            <tbody key={index}>
              <tr>
                <td>{person.name}</td>
                <td>{person.height}</td>
                <td>{person.mass}</td>
                { }
                <td> {calculatePower(person.height, person.mass)} </td>
              </tr>
            </tbody>
          )


        })}
      </table>


    </div>
  );
}


export default FunctionalComp;
