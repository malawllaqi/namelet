import { names, adjectives, cities, colors, starWars } from "./utils/words.ts";
import type { Casing, NameOpts } from "./utils/types.ts";

const dictionaries = { names, adjectives, cities, colors, starWars };

class Namelet {
  private readonly options: Required<NameOpts>;

  constructor({ wordLists, separator = "-", casing = "lowerCase" }: NameOpts) {
    this.options = { wordLists: [...wordLists], separator, casing };
  }

  generate(): string {
    const { wordLists, separator, casing } = this.options;

    const name = wordLists
      .map((list) => {
        const word = this.pickWord(dictionaries[list]);
        // Capitalize before joining so word boundaries survive an empty separator.
        const formatted = casing === "capital" ? this.casingFmt(word, casing) : word;
        return formatted.split(" ").join(separator);
      })
      .join(separator);

    return casing === "capital" ? name : this.casingFmt(name, casing);
  }

  private pickWord(words: string[]): string {
    if (words.length === 0) {
      throw new Error("Cannot pick from an empty word list");
    }

    const index = Math.floor(Math.random() * words.length);
    return words[index];
  }

  private casingFmt(word: string, casing: Casing): string {
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
}

export function createName(options: NameOpts) {
  return new Namelet(options).generate();
}
