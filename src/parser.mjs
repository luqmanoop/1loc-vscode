export const purifyMd = (mdStr) => {
  return mdStr
    .replace(/\/\/.*/g, "") // remove comment `// Or`
    .replace(/\n/g, "") // remove newline and keep inline content
    .replace(/\*\*```/g, "**\n```") // add newline after bold headline i.e. **JavaScript version**\n
    .replace(/```\*\*/g, "```\n**"); // start newline between closing blockquote & bold headline i.e. ````\n**JavaScript version**
};

export const snippetsFromMd = (purifiedMd, lang = "javascript") => {
  const regex = new RegExp(
    `((\\*\\*(${lang}) version\\*\\*)(\\n.*\\n?))+`,
    "gi"
  );
  const snippet = purifiedMd.match(regex);

  if (!snippet) throw new Error(`No ${lang} snippet found`);
  return snippet[0];
};

export const purifySnippet = (snippet, langExtension = "js") => {
  return snippet
    .replace(/```js/g, "")
    .replace(/;```/g, ";\n```")
    .replace(/(\*\*.*\*\*)/g, `\`\`\`${langExtension}`)
    .split(`\`\`\`${langExtension}`)[1]
    .slice(0, -4)
    .replace(/\s{2,}\./g, ".")
    .replace(/\s{2,}/g, " ")
    .replace(/\n/g, "");
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
