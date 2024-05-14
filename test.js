// Import the readline module
const readline = require('readline');

// Create an interface for input and output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt the user for their name
rl.question('Please enter your name: ', (answer) => {
    // Output the response
    console.log(`Hello, ${answer}!`);

    // Close the readline interface
    rl.close();
});
