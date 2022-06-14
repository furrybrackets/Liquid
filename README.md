# Liquid
Liquid is a super-amazing, modern Markdown static-site generator.

## Why use Liquid?
You can basically do anything with Liquid. Liquid supports:

* Interactivity
* Templating
* JavaScript
* Custom CSS
* Overloading (Modifying already included operators such as CodeBlocks)
* Custom Operators
* Custom Rendering
* *And more!*

## Getting Started

Install the Liquid CLI tool.

Yarn:
```
yarn add liquid-tool --dev
```

NPM:
```
npm i liquid-tool --dev
```

Use the CLI tool to scaffold your project.

```
liquid-tool init
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
liquid-tool dev
```
Liquid will print something like (emojis only display for terminals with emoji support):
```
✔️ built in 1.32 seconds
📦 bundle size: 1.32 kB

✨ hosting on localhost:3000
🎧 listening for changes
```
If you head over to `localhost:3000`, you should see a title "Click the button." and a button with a number on it. Try clicking it.
