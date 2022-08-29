import { CharacterType } from "./types";
const URL = "https://swapi.dev/api/people";

export const getFilteredCharacters = ({
  characters,
  query,
}: {
  characters: CharacterType[];
  query: string;
}) => {
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
export function calculatePower(
  character: CharacterType,
  multiplier: number
): string {
  if (character.mass === "unknown" || character.height === "unknown") {
    return "-";
  }
  return Math.round(
    Number(character.mass) * Number(character.height) * multiplier
  ).toString();
}
