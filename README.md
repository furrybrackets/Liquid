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

Liquid uses a minimal component model to maximize compatibility. Each component is defined via a class with only a few key functions. By default Liquid uses raw HTML strings but has support for JSX. To enable JSX, do so in your `liquid.config.js`

```js
module.exports = {
 name: 'ProjectName',
 author: 'John Doe',
 // ...
 useJSX: true
}
```
JSX example:
```jsx
import { Component } from '@liquid/core';
class Counter extends Component {
  constructor(count, el) {
   super(el);
   this.registerParams([{
    name: 'count',
    type: 'number',
    initialize: count
   }]);
  };
  
  increment() {
    this.count++;
    this.el.innerText = this.count;
  };
  
  setup() {
   this.el.addEventListener('click', () => {
    this.increment();
   });
   this.el.innerText = '0';
  }
}

export defualt {
 component: Counter,
 html: <button></button>
};
```
