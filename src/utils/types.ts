export type Casing = "lowerCase" | "upperCase" | "capital";

// type WordLists = "adjectives" | "names" | "colors"

export type WordLists = "names" | "adjectives" | "cities" | "colors" | "starWars";

export interface NameOpts {
  wordLists: WordLists[];
  separator?: string;
  casing?: Casing;
}
