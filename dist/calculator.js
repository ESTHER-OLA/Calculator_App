"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
var OperationChoice;
(function (OperationChoice) {
    OperationChoice[OperationChoice["ADD"] = 1] = "ADD";
    OperationChoice[OperationChoice["SUBTRACT"] = 2] = "SUBTRACT";
    OperationChoice[OperationChoice["MULTIPLY"] = 3] = "MULTIPLY";
    OperationChoice[OperationChoice["DIVIDE"] = 4] = "DIVIDE";
    OperationChoice[OperationChoice["EXIT"] = 5] = "EXIT";
})(OperationChoice || (OperationChoice = {}));
// =================== MATH FUNCTIONS ===================
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    if (b === 0) {
        throw new Error('Division by zero is not allowed.');
    }
    return a / b;
}
// =================== CLI ===================
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function displayWelcomeMessage() {
    console.log('Welcome to TypeScript Calculator!');
}
function showOperations() {
    console.log(`
Choose an operation:
1. Add
2. Subtract
3. Multiply
4. Divide
5. Exit
  `);
}
// =================== INPUT HANDLING ===================
function promptForOperation() {
    return new Promise((resolve) => {
        rl.question('Enter your choice: ', resolve);
    });
}
function getNumberInput(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, (input) => {
            const num = validateNumber(input);
            if (num !== null) {
                resolve(num);
            }
            else {
                handleInvalidInput(input);
                resolve(getNumberInput(prompt));
            }
        });
    });
}
function validateNumber(input) {
    const num = Number(input);
    return isNaN(num) ? null : num;
}
function handleInvalidInput(input) {
    console.log(`Invalid input "${input}". Please enter a valid number.`);
}
// =================== ERROR HANDLING ===================
function handleCalculationError(error) {
    console.log(`Error: ${error.message}`);
}
function exitGracefully() {
    console.log('Exiting... Goodbye!');
    rl.close();
    process.exit(0);
}
// =================== MAIN LOGIC ===================
async function mainMenuLoop() {
    displayWelcomeMessage();
    const history = [];
    while (true) {
        showOperations();
        const choiceInput = await promptForOperation();
        const choice = parseInt(choiceInput);
        if (isNaN(choice) || choice < 1 || choice > 5) {
            console.log('Invalid choice. Please select a number between 1 and 5.');
            continue;
        }
        if (choice === OperationChoice.EXIT) {
            exitGracefully();
        }
        const operand1 = await getNumberInput('Enter first number: ');
        const operand2 = await getNumberInput('Enter second number: ');
        let result;
        try {
            switch (choice) {
                case OperationChoice.ADD:
                    result = add(operand1, operand2);
                    break;
                case OperationChoice.SUBTRACT:
                    result = subtract(operand1, operand2);
                    break;
                case OperationChoice.MULTIPLY:
                    result = multiply(operand1, operand2);
                    break;
                case OperationChoice.DIVIDE:
                    result = divide(operand1, operand2);
                    break;
                default:
                    throw new Error('Unknown operation');
            }
            console.log(`Result: ${result}`);
            history.push({
                operation: OperationChoice[choice],
                operand1,
                operand2,
                result,
            });
        }
        catch (error) {
            handleCalculationError(error);
        }
    }
}
mainMenuLoop();
