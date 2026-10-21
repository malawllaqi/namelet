import { names, adjectives, cities, colors, starWars } from "./utils/words.ts";
import type { Casing, NameOpts } from "./utils/types.ts";

const dictionaries = { names, adjectives, cities, colors, starWars };

export function createName({ wordLists, separator = "-", casing = "lowerCase" }: NameOpts) {
  const name = wordLists
    .map((list) => {
      const word = pickWord(dictionaries[list]);
      // Capitalize before joining so word boundaries survive an empty separator.
      const formatted = casing === "capital" ? casingFmt(word, casing) : word;
      return formatted.split(" ").join(separator);
    })
    .join(separator);
  return casing === "capital" ? name : casingFmt(name, casing);
}

function pickWord(words: string[]) {
  if (words.length === 0) {
    throw new Error("Cannot pick from an empty word list");
  }

  const index = Math.floor(Math.random() * words.length);
  return words[index];
}

function casingFmt(word: string, casing: Casing) {
  switch (casing) {
    case "upperCase":
      return word.toUpperCase();

    case "lowerCase":
      return word.toLowerCase();

    case "capital":
      return word
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");

    default:
      return word;
  }
}
