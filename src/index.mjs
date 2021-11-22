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
      const { title } = parseMdTitleNCategory(md);
      const jsSnippet = parseMdSnippet(
        purifySnippet(snippetsFromMd(purifyMd(md)))
      );

      result[title] = {
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

      return result;
    })
    .reduce((prev, curr) => {
      return {
        ...prev,
        ...curr,
      };
    }, {});

  const snippetJSONFilePath = `${process.cwd()}/1loc/snippets/1loc.code-snippets`;
  fs.writeFileSync(snippetJSONFilePath, JSON.stringify(parsedSnippets));
});
