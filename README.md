# Liquid
Liquid is a super-amazing, modern Markdown static-site generator.

## Why use Liquid?
You can basically do anything with Liquid. Liquid supports:

* Interactivity
* Templating
* JavaScript
* Custom CSS
* Custom Operators
* Custom Renderers
* *And more!*

## Getting Started

Install the Liquid CLI tool.

Yarn:
```
yarn add @liquidmd/cli --dev
```

NPM:
```
npm i @liquidmd/cli --dev
```

Use the CLI tool to scaffold your project.

```
liquid init
```
The tool will then ask you questions for your `liquid.config` file.
```
Name (project): Example
Package Manager (yarn): yarn
Author: John Doe
```
It will then generate the necessary folder structure.
```
📦Example
 ┣ 📂components
 ┃ ┗ 📜Counter.js
 ┣ 📂pages
 ┃ ┗ 📜index.md
 ┣ 📂public
 ┃ ┗ 📜main.css
 ┣ 📜liquid.config.tc
 ┗ 📜package.json
```

### Running your new website
Liquid supports Hot Reload, meaning that it'll automatically rebuild your website when changes are made. To spin up a website, run:
```
liquid dev
```
Liquid will print something like (emojis only display for terminals with emoji support):
```
✔️ built in 1.32 seconds
📦 bundle size: 1.32 kB

✨ hosting on localhost:3000
🎧 listening for changes
```
If you head over to `localhost:3000`, you should see a title "Click the Button!" and a button with a number on it. Try clicking it.

## Introduction to Components

Liquid uses MDX, a type of Markdown which allows you to include HTML and JSX inside of your Markdown. Liquid exposes a simple option in your `liquid.config.js` to change the rendering engine (Vue, React, Preact, etc) for your JSX.

```js
// liquid.config.js
module.exports = {
  jsxImportSource: 'react'
} 
```
