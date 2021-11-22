import fs from "fs";
import glob from "glob";
import { dirname, join, resolve } from "path";
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
const __dirname = dirname(__filename);

glob("snippets/**/*.md", { cwd: __dirname }, (err, matches) => {
  if (err) throw new Error("No .md snippet file found.");

  const snippetPaths = matches.map((path) => `${__dirname}/${path}`);

  const parsedSnippets = snippetPaths
    .map((snippetPath) => {
      const snippetLocation = snippetPath.split("/").slice(-2).join("/");
      const md = fs.readFileSync(snippetPath, "utf-8");
      const result = {};
      const { category, title } = parseMdTitleNCategory(md);
      const jsSnippet = parseMdSnippet(
        purifySnippet(snippetsFromMd(purifyMd(md)))
      );

      result[title] = {
        prefix: `1loc${jsSnippet.name}`,
        body: [addCredit(jsSnippet.code, snippetLocation)],
        description: title,
      };

      return result;
    })
    .reduce((a, b) => {
      return {
        ...a,
        ...b,
      };
    }, {});

  const snippetJSONFilePath = `${process.cwd()}/1loc/snippets/1loc.code-snippets`;
  fs.writeFileSync(snippetJSONFilePath, JSON.stringify(parsedSnippets));
});
