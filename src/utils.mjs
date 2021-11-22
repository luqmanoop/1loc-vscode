import fs from "fs";
import glob from "glob";
import { dirname } from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";

import {
  parseMdTitleNCategory,
  parseMdSnippet,
  purifyMd,
  purifySnippet,
  snippetsFromMd,
  addCredit,
} from "./parser.mjs";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const globWithPromise = promisify(glob);

export const getSnippetsPath = (pattern, opts = { cwd: __dirname }) => {
  return globWithPromise(pattern, opts).then((matches) =>
    matches.map((path) => `${__dirname}/${path}`)
  );
};

export const writeSnippetToFile = (path, jsonSnippet) => {
  fs.writeFileSync(path, jsonSnippet);
};

export const buildJSONSnippets = (snippetPaths) => {
  return snippetPaths
    .map((snippetPath) => {
      const snippetLocation = snippetPath.split("/").slice(-2).join("/");
      const md = fs.readFileSync(snippetPath, "utf-8");

      const result = { js: {}, ts: {} };

      const { title } = parseMdTitleNCategory(md);
      const purifiedMd = purifyMd(md);

      const jsSnippet = parseMdSnippet(
        purifySnippet(snippetsFromMd(purifiedMd, "javascript"), "js")
      );
      const tsSnippet = parseMdSnippet(
        purifySnippet(snippetsFromMd(purifiedMd, "typescript"), "ts")
      );

      result.js[title] = {
        prefix: `1loc${jsSnippet.name}`,
        body: [
          addCredit(snippetLocation),
          ...jsSnippet.snippets.slice(0, 3).reduce((prev, curr) => {
            if (!prev.length) return [curr];
            return [...prev, "// or", curr];
          }, []),
        ],
        description: title,
      };

      result.ts[title] = {
        prefix: `1loc${tsSnippet.name}`,
        body: [
          addCredit(snippetLocation),
          ...tsSnippet.snippets.slice(0, 3).reduce((prev, curr) => {
            if (!prev.length) return [curr];
            return [...prev, "// or", curr];
          }, []),
        ],
        description: title,
      };

      return result;
    })
    .reduce(
      (prev, curr) => {
        const [jsSnippets, tsSnippets] = prev;
        return [
          { ...jsSnippets, ...curr.js },
          { ...tsSnippets, ...curr.ts },
        ];
      },
      [{}, {}]
    )
    .map((snippet) => JSON.stringify(snippet));
};
