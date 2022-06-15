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
If you head over to `localhost:3000`, you should see a title "Click the Button!" and a button with a number on it. Try clicking it.

## Introduction to Components
Components are one of the main *special features* that Liquid has. Every component is defined via a class. Most *Components* will be *multi-line*, but we'll implement a *generated* component (doesn't have a body).

```jsx
// Counter class
class Counter {
    constructor(count, el) {
     this.count = count;
     this.el = el; // Root element created by Liquid
    };

    // Increment the counter
    increment() {
        this.count++;
        this.el.innerText = this.count;
    };

    setup() {
        // attach event listener to the button
        this.el.addEventListener('click', () => {
            this.increment();
        });
    };
}

module.exports = {
    Component: Counter, // main component
    rootElement: {
        type: 'button' // Liquid will pass this component a generated root element to manipulate.
    }
};
```

This gets converted into JavaScript:

```js
class Counter {
    constructor(count, el) {
     this.count = count;
     this.el = el; // Root element created by Liquid
    };

    // Increment the counter
    increment() {
        this.count++;
        this.el.innerText = this.count;
    };

    setup() {
        // attach event listener to the button
        this.el.addEventListener('click', () => {
            this.increment();
        });
    };
};

const __CounterInstance = new Counter(0, document.getElementById('counter__buttonin'));
__CounterInstance.setup();
```
Looks great! Our code works. Except we have one problem, our button is blank on setup! How do we fix that? Just add it to the end of our `setup()` function.
```jsx
// Counter class
class Counter {
    constructor(count, el) {
     this.count = count;
     this.el = el; // Root element created by Liquid
    };

    // Increment the counter
    increment() {
        this.count++;
        this.el.innerText = this.count;
    };

    setup() {
        // attach event listener to the button
        this.el.addEventListener('click', () => {
            this.increment();
        });
        this.el.innerText = '0';
    };
}

module.exports = {
    Component: Counter, // main component
    rootElement: {
        type: 'button' // Liquid will pass this component a generated root element to manipulate.
    }
};
```
That's it!

## Using Components in Markdown
Let's first refer back to our current directory:
```
📦Example
 ┣ 📂components
 ┃ ┗ 📜Counter.js <-- This is our component!
 ┣ 📂pages
 ┃ ┗ 📜index.md <-- Main Markdown file
 ┣ 📂public
 ┃ ┗ 📜main.css
 ┣ 📜liquid.config.tc
 ┗ 📜package.json
```
If we want to use our new component, all we have to do is reference it from any of our pages and it'll get automatically imported.

```markdown
# Click the Button!

@Counter(0)
```

### A Quick Divergence into the Liquid Rendering System
The entire Liquid ecosystem is built out of *renderers*, which is are most abstractly, classes that convert raw data into HTML code. While an actual renderer definition is much more complex, we can illustrate how they work using an abstraction.

Let's say we want to render a number and make it look cool. Let's say in the Markdown we want to denote a number using `&& number &&`. Liquid doesn't provide us with a method of parsing, so we'll have to do it ourselves.

To summarize, here's what we want to do.

* Find numbers and/or text enclosed in `&&`
* Render out new HTML with the text we found
* Pass that to Liquid
