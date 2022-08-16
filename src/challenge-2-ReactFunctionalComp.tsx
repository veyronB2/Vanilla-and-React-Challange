import { useEffect, useReducer, useState } from "react"
import { initialState, ACTIONS } from "./constants";
import { getFilteredCharacters, fetchAllData } from "./utils"




const useGetData = () => {
  const [state, setState] = useState({ data: [], loading: true });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const characters = await fetchAllData();
    setState({ data: characters, loading: false, });

  }

  return state;
}
const reducer = (state, action) => {

  const { payload } = action;

  const map: { [key: string]: Function } = {
    [ACTIONS.FETCH]: initiateState,
    [ACTIONS.MULTIPLIER]: updatePower,
    [ACTIONS.QUERY]: nameFilter,
    [ACTIONS.RESET]: resetState,
  }

  return map[action.type] ? map[action.type]() : state

  function nameFilter() {
    const { query } = payload;
    return {

      ...state, filteredCharacters: getFilteredCharacters({
        characters: action.payload.characters || [],
        query: query || "",
      }),
      query: query,

    }
  }

  function updatePower() {
    return { ...state, multiplier: action.payload }
  }

  function initiateState() {
    return { ...state, filteredCharacters: getFilteredCharacters({ characters: payload.characters || [], filter: state.filter }) };
  }

  function resetState() {
    const { query } = initialState;
    return {
      ...initialState,
      filteredCharacters: getFilteredCharacters({
        characters: payload.characters || [],
        query,
      })
    }

  }

}
function FunctionalComp() {
  const { data: characters, loading } = useGetData();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { filteredCharacters, multiplier, query } = state;


  useEffect(() => {
    if (characters && characters.length) {
      dispatch({ type: ACTIONS.FETCH, payload: { characters } });
    }
  }, [characters, dispatch])


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
        dispatch({ type: ACTIONS.RESET, payload: characters })
      }

    };
    const container = document.getElementById("functional-comp");
    container.addEventListener('keydown', handleEsc);

    //remove event listener to avoid memory leaks etc 
    return () => {
      container.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleNameFilter = (e) => {
    dispatch({ type: ACTIONS.QUERY, payload: { characters, query: e.target.value } })
  }


  return (



    <div id="functional-comp">
      <h2>React Functional Component</h2>

      Filter: <input value={query} placeholder="Filter by name" onChange={handleNameFilter} /> Multiplier:
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
