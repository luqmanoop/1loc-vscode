# 1loc-vscode

<img src="src/images/logo.png" width="100" alt="1loc vscode logo"/>

> A VSCode extension for common JavaScript utilities in one line of code (loc)!

## Motivation

Time flies finding the snippets I want on the [1loc](https://1loc.dev) website. This was an attempt to make it easily accessible to have all snippets at my finger tips in the [code editor](https://code.visualstudio.com/) I (& millions of developers) use every day. This project was originally forked from [1loc](https://github.com/1milligram/1loc)

<div style="position: relative; width: 100%; height: 170px; overflow: hidden;">
<video autoplay loop style="width:100%; position: absolute; top: -10px; bottom: 0;">
    <source src="https://github.com/codeshifu/assets/blob/main/videos/1loc-vscode.mp4?raw=true">
</video>
</div>

## Run it locally

```bash
git clone git@github.com:codeshifu/1loc-vscode.git

cd 1loc-vscode

yarn install

yarn dev
```

Generated snippets can be found in `extension/snippets` folder

## Packaging

You should have `vsce` installed globally

```bash
yarn global add vsce
# or
npm install -g vsce
```

then run in the root dir i.e. `1loc-vscode`

```bash
yarn package
```

## Author

<table><tr><td align="center"><a href="https://twitter.com/codeshifu"><img src="https://avatars0.githubusercontent.com/u/5154605?v=4" width="100px;" alt="Luqman Olushi O."/><br /><sub><b>Luqman Olushi O.</b></sub></a></table>

## License

This project is licensed under
[MIT](https://github.com/codeshifu/1loc-vscode/blob/main/extension/license.md)
