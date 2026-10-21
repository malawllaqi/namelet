# namelet

Tiny, flexible name generator for JavaScript and TypeScript.

## Installation

```sh
npm install namelet
```

## Usage

```ts
import { createName } from "namelet";

const name = createName({
  wordLists: ["adjectives", "colors", "names"],
});

console.log(name); // e.g. "brave-red-alice"
```

`createName` randomly selects one entry from each requested dictionary, keeps the
requested order, and joins the entries with a separator. By default, the separator
is `"-"` and the result is lowercase.

## Options

| Option      | Type          | Default       | Description                                                                                        |
| ----------- | ------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| `wordLists` | `WordLists[]` | Required      | Dictionaries to select from, in order.                                                             |
| `separator` | `string`      | `"-"`         | Text between entries and in place of spaces within an entry. Use `""` to join without a separator. |
| `casing`    | `Casing`      | `"lowerCase"` | `"lowerCase"`, `"upperCase"`, or `"capital"`.                                                      |

Available dictionaries: `"names"`, `"adjectives"`, `"cities"`, `"colors"`, and
`"starWars"`.

Repeat a dictionary to select more than one entry from it:

```ts
createName({
  wordLists: ["names", "names"],
  separator: "_",
  casing: "upperCase",
});
```

Each selection is independent, so repeated entries are possible. An empty
`wordLists` array returns an empty string. Entries can contain multiple words, so
the number of visible words can exceed the number of requested dictionaries.

## Casing

For an entry such as `"Anakin Skywalker"`, the default separator produces:

| Casing        | Result               |
| ------------- | -------------------- |
| `"lowerCase"` | `"anakin-skywalker"` |
| `"upperCase"` | `"ANAKIN-SKYWALKER"` |
| `"capital"`   | `"Anakin-Skywalker"` |

`"capital"` uppercases the first character of each space-separated word and
lowercases the rest. For example, `"McDonald"` becomes `"Mcdonald"`. Capitalization
happens before joining, so `separator: ""` produces `"AnakinSkywalker"` for that
entry. Punctuation within words is preserved.

`"lowerCase"` and `"upperCase"` apply to the complete result, including any letters
in the separator. `"capital"` preserves the separator as supplied.

## TypeScript

The package includes TypeScript declarations and exports its option types:

```ts
import { createName } from "namelet";
import type { Casing, NameOpts, WordLists } from "namelet";

const wordLists: WordLists[] = ["adjectives", "names"];
const casing: Casing = "capital";
const options: NameOpts = { wordLists, casing, separator: "_" };

const name: string = createName(options);
```

This package uses ES modules. Generation uses `Math.random()`; custom dictionaries
and seeded generation are not currently supported.

## License

MIT
