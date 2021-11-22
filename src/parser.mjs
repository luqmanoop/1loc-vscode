export const purifyMd = (mdStr) => {
  return mdStr
    .replace(/\/\/.*/g, "") // remove comment `// Or`
    .replace(/\n/g, "") // remove newline and keep inline content
    .replace(/\*\*```/g, "**\n```") // add newline after bold headline i.e. **JavaScript version**\n
    .replace(/```\*\*/g, "```\n**"); // start newline between closing blockquote & bold headline i.e. ````\n**JavaScript version**
};

export const findLanguageSnippetsFromMd = (lang, purifiedMd) => {
  const regex = new RegExp(
    `((\\*\\*(${lang}) version\\*\\*)(\\n.*\\n?))+`,
    "gi"
  );
  const snippet = purifiedMd.match(regex);

  return !snippet
    ? findLanguageSnippetsFromMd("javascript", purifiedMd) // default to js if no ts snippets found
    : snippet[0];
};

export const snippetsFromMd = (purifiedMd, lang = "javascript") => {
  const snippet = findLanguageSnippetsFromMd(lang, purifiedMd);

  if (!snippet) throw new Error(`No ${lang} snippet found`);
  return snippet;
};

export const purifySnippet = (snippet, langExt = "js") => {
  return (
    snippet
      // currently, all snippets code block assum 'js' alias, remove all ```js
      .replace(/```js/g, "")
      .replace(/;```/g, ";\n```")
      /* replace all **JavaScript|TypeScript** with ```{langExt}
        set snippets code block to use dynamic 'langExt' alias */
      .replace(/(\*\*.*\*\*)/g, `\`\`\`${langExt}`)
      .split(`\`\`\`${langExt}`)[1]
      .slice(0, -4)
      .replace(/\s{2,}\./g, ".")
      .replace(/\s{2,}/g, " ")
      .replace(/\n/g, "")
  );
};

export const parseMdSnippet = (purifiedSnippet) => {
  const functionName = purifiedSnippet.split(" ")[1];

  const snippets = purifiedSnippet
    .split(RegExp(`const ${functionName} = `))
    .filter(Boolean)
    .map((anonymousFn) => {
      return `const ${functionName} = ${anonymousFn}`;
    });

  return {
    name: functionName,
    snippets,
  };
};

export const parseMdTitleNCategory = (md) => {
  return md
    .split("---", 2)
    .filter(Boolean)
    .reduce((a, b) => {
      const [title, category] = b.split(/[\n]/g).filter(Boolean);

      return {
        ...a,
        title: title.replace(/title:\s/gi, ""),
        category: category.replace(/category:\s/gi, ""),
      };
    }, {});
};

export const addCredit = (filePath) => {
  return `// https://github.com/1milligram/1loc/blob/master/snippets/${filePath}`;
};
