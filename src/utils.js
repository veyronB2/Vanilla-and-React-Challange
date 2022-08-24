const URL = "https://swapi.dev/api/people";

export const getFilteredCharacters = ({ characters, query }) => {
  return characters.filter((character) => {
    return query
      ? character.name.toLowerCase().includes(query.toLowerCase())
      : characters;
  });
};

export const fetchAllData = async (url = URL, accumulatedResult = []) => {
  try {
    const response = await fetch(url);
    const people = await response.json();
    const results = [...accumulatedResult, ...people.results];

    //get url of the next page
    const nextPage = people.next;

    if (nextPage) {
      return await fetchAllData(nextPage, results);
    }
    return results;
  } catch (error) {
    console.log(error);
  }
};

/*************** calculate power  ************************************/
export function calculatePower(character, multiplier) {
  if (isNaN(character.mass) || isNaN(character.height)) {
    return "-";
  }
  const power =
    parseFloat(character.mass) *
    parseFloat(character.height) *
    parseFloat(multiplier);

  return power.toFixed(0);
}
