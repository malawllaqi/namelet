import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { createName } from "../src/index.ts";
import type { Casing, NameOpts, WordLists } from "../src/index.ts";
import { names } from "../src/utils/words.ts";

vi.mock("../src/utils/words.ts", () => ({
  names: ["Alice", "McDonald", "Zoe"],
  adjectives: ["Brave", "Calm", "Wise"],
  cities: ["nEW yORK cITY", "Paris", "Tokyo"],
  colors: ["Red", "Green", "Blue"],
  starWars: ["Anakin Skywalker", "Leia Organa", "Yoda"],
}));

describe("createName", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to lowercase words joined with a hyphen", () => {
    expect(createName({ wordLists: ["adjectives", "names"] })).toBe("brave-alice");
  });

  it.each<[WordLists, string]>([
    ["names", "alice"],
    ["adjectives", "brave"],
    ["cities", "new-york-city"],
    ["colors", "red"],
    ["starWars", "anakin-skywalker"],
  ])("selects a word from %s without adding an outer separator", (list, expected) => {
    expect(createName({ wordLists: [list] })).toBe(expected);
  });

  it("preserves the requested dictionary order", () => {
    expect(createName({ wordLists: ["colors", "names", "adjectives"] })).toBe("red-alice-brave");
    expect(createName({ wordLists: ["adjectives", "names", "colors"] })).toBe("brave-alice-red");
  });

  it("selects independently for each occurrence of a repeated dictionary", () => {
    vi.mocked(Math.random).mockReturnValueOnce(0).mockReturnValueOnce(0.5);

    expect(createName({ wordLists: ["names", "names"] })).toBe("alice-mcdonald");
  });

  it.each([
    ["_", "brave_alice"],
    ["::", "brave::alice"],
    ["", "bravealice"],
  ])("supports separator %j", (separator, expected) => {
    expect(createName({ wordLists: ["adjectives", "names"], separator })).toBe(expected);
  });

  it.each([
    ["-", "new-york-city-anakin-skywalker"],
    ["_", "new_york_city_anakin_skywalker"],
    ["", "newyorkcityanakinskywalker"],
  ])("replaces every space inside words with separator %j", (separator, expected) => {
    expect(createName({ wordLists: ["cities", "starWars"], separator })).toBe(expected);
  });

  it("converts the complete name to lowercase when explicitly requested", () => {
    expect(createName({ wordLists: ["cities", "names"], casing: "lowerCase" })).toBe(
      "new-york-city-alice",
    );
  });

  it("converts the complete name to uppercase", () => {
    expect(createName({ wordLists: ["cities", "names"], casing: "upperCase" })).toBe(
      "NEW-YORK-CITY-ALICE",
    );
  });

  it.each([
    ["-", "New-York-City-Mcdonald"],
    ["_", "New_York_City_Mcdonald"],
    ["::", "New::York::City::Mcdonald"],
    ["", "NewYorkCityMcdonald"],
    ["xX", "NewxXYorkxXCityxXMcdonald"],
  ])("capitalizes each word before joining with separator %j", (separator, expected) => {
    vi.mocked(Math.random).mockReturnValueOnce(0).mockReturnValueOnce(0.5);

    const casing: Casing = "capital";
    const options: NameOpts = { wordLists: ["cities", "names"], separator, casing };

    expect(createName(options)).toBe(expected);
  });

  it.each<Casing>(["lowerCase", "upperCase", "capital"])(
    "returns an empty string when no dictionaries are requested with %s casing",
    (casing) => {
      expect(createName({ wordLists: [], casing })).toBe("");
    },
  );

  it("capitalizes lowercase dictionary entries", () => {
    const originalNames = names.splice(0, names.length, "alice");

    try {
      expect(createName({ wordLists: ["names"], casing: "capital" })).toBe("Alice");
    } finally {
      names.splice(0, names.length, ...originalNames);
    }
  });

  it("throws when a selected dictionary is empty", () => {
    const originalNames = names.splice(0);

    try {
      expect(() => createName({ wordLists: ["names"] })).toThrow(
        "Cannot pick from an empty word list",
      );
    } finally {
      names.push(...originalNames);
    }
  });

  it.each([
    [0, "alice"],
    [0.5, "mcdonald"],
    [1 - Number.EPSILON, "zoe"],
  ])("selects the expected word when Math.random returns %s", (random, expected) => {
    vi.mocked(Math.random).mockReturnValue(random);

    expect(createName({ wordLists: ["names"] })).toBe(expected);
  });
});
