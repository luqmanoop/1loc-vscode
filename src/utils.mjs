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

export const addCredit = (filePath) => {
  return `https://github.com/1milligram/1loc/blob/master/snippets/${filePath}`;
};

export const buildCodeSnippet = ({
  title,
  name,
  category,
  snippets,
  credit,
}) => {
  const similarSnippets =
    snippets.length > 1
      ? [`\n  --- OR ---`, ...snippets.slice(1).map((v) => `  ${v}`)]
      : [];

  return {
    prefix: [`1loc${name}`, `1loc${category.replace(/\s+/, "")}`],
    body: [
      `\${1:/**\n * ${title}`,
      ` * ${credit}`,
      ...similarSnippets,
      '*/',
      `}${snippets[0]}`,
    ],
    description: title,
  };
};

export const getLanguageSnippets = (snippetPaths) => {
  return snippetPaths
    .map((snippetPath) => {
      const snippetLocation = snippetPath.split("/").slice(-2).join("/");
      const md = fs.readFileSync(snippetPath, "utf-8");

      const result = { js: {}, ts: {} };

      const { title, category } = parseMdTitleNCategory(md);
      const purifiedMd = purifyMd(md);

      const jsSnippet = parseMdSnippet(
        purifySnippet(snippetsFromMd(purifiedMd, "javascript"), "js")
      );
      const tsSnippet = parseMdSnippet(
        purifySnippet(snippetsFromMd(purifiedMd, "typescript"), "ts")
      );

      result.js[title] = buildCodeSnippet({
        title,
        category,
        ...jsSnippet,
        credit: addCredit(snippetLocation),
      });

      result.ts[title] = buildCodeSnippet({
        title,
        category,
        ...tsSnippet,
        credit: addCredit(snippetLocation),
      });

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
