const URL = "https://swapi.dev/api/people";

export const getFilteredCharacters = ({ characters, filter }) => {
  return characters.filter((character) => {
    return filter
      ? character.name.toLowerCase().includes(filter.toLowerCase())
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
