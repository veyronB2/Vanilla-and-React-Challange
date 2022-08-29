import React, { useEffect, useReducer, useState } from "react"
import { initialState, ACTIONSReact, ACTIONS } from "./constants";
import { UIState, Action, Payload } from "./types";
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
const reducer = (state: UIState, action: Action): UIState => {

  const { payload } = action;

  const map: { [key: string]: Function } = {
    [ACTIONSReact.FETCH]: initiateState,
    [ACTIONSReact.MULTIPLIER]: updatePower,
    [ACTIONSReact.QUERY]: nameFilter,
    [ACTIONSReact.RESET]: resetState,
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

  function updatePower(): UIState {
    return { ...state, multiplier: payload.multiplier }
  }

  function initiateState(): UIState {
    return { ...state, filteredCharacters: getFilteredCharacters({ characters: payload.characters || [], query: state.query }) };
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
      dispatch({ type: ACTIONSReact.FETCH, payload: { characters } });
    }
  }, [characters, dispatch])


  /* calculate power based on values passed  */
  function calculatePower(height: string, mass: string): string {

    //make sure NaN is not shown 
    if (mass == "unknown" || height === "unknown") {
      return "-";
    }
    //return final power
    return Math.round(Number(height) * Number(mass) * state.multiplier).toString();
  }

  //filter keys. More can be added if needed to filter on all columns 
  const keys = ["name"];

  //handle escape key press
  useEffect(() => {

    const handleEsc = (event: { key: string; }) => {
      //reset to defaults
      if (event.key === "Escape") {
        dispatch({ type: ACTIONSReact.RESET, payload: { characters } })
      }

    };
    const container = document.getElementById("functional-comp");
    container.addEventListener('keydown', handleEsc);

    //remove event listener to avoid memory leaks etc 
    return () => {
      container.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleNameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ACTIONSReact.QUERY, payload: { characters, query: e.target.value } })
  }

  const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ACTIONSReact.MULTIPLIER, payload: { multiplier: Number(e.target.value) } })
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
        onChange={handleMultiplierChange}
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
