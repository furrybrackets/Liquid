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
    // Setup the counter after Liquid creates the root
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