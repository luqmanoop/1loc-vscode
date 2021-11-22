import {
  getSnippetsPath,
  getLanguageSnippets,
  writeSnippetToFile,
} from "./utils.mjs";

const SNIPPETS_PATH_PATTERN = "snippets/**/*.md";
const ROOT_SNIPPETS_DIR = `${process.cwd()}/1loc/snippets`;
const JS_1LOC_SNIPPETS_PATH = `${ROOT_SNIPPETS_DIR}/1loc.code-snippets`;
const TS_1LOC_SNIPPETS_PATH = `${ROOT_SNIPPETS_DIR}/1loc-ts.code-snippets`;

getSnippetsPath(SNIPPETS_PATH_PATTERN)
  .then((snippetPaths) => {
    const [jsSnippets, tsSnippets] = getLanguageSnippets(snippetPaths);
    writeSnippetToFile(JS_1LOC_SNIPPETS_PATH, jsSnippets);
    writeSnippetToFile(TS_1LOC_SNIPPETS_PATH, tsSnippets);
  })
  .catch(console.log);
