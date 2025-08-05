import readline from 'readline';

// =================== TYPES ===================

interface CalculationHistory {
  operation: string;
  operand1: number;
  operand2: number;
  result: number;
}

enum OperationChoice {
  ADD = 1,
  SUBTRACT,
  MULTIPLY,
  DIVIDE,
  EXIT,
}

// =================== MATH FUNCTIONS ===================

function add(a: number, b: number): number {
  return a + b;
}

function subtract(a: number, b: number): number {
  return a - b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero is not allowed.');
  }
  return a / b;
}

// =================== CLI ===================

const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function displayWelcomeMessage(): void {
  console.log('Welcome to TypeScript Calculator!');
}

function showOperations(): void {
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

function promptForOperation(): Promise<string> {
  return new Promise((resolve) => {
    rl.question('Enter your choice: ', resolve);
  });
}

function getNumberInput(prompt: string): Promise<number> {
  return new Promise((resolve) => {
    rl.question(prompt, (input: string) => {
      const num = validateNumber(input);
      if (num !== null) {
        resolve(num);
      } else {
        handleInvalidInput(input);
        resolve(getNumberInput(prompt));
      }
    });
  });
}

function validateNumber(input: string): number | null {
  const num = Number(input);
  return isNaN(num) ? null : num;
}

function handleInvalidInput(input: string): void {
  console.log(`Invalid input "${input}". Please enter a valid number.`);
}

// =================== ERROR HANDLING ===================

function handleCalculationError(error: Error): void {
  console.log(`Error: ${error.message}`);
}

function exitGracefully(): void {
  console.log('Exiting... Goodbye!');
  rl.close();
  process.exit(0);
}

// =================== MAIN LOGIC ===================

async function mainMenuLoop(): Promise<void> {
  displayWelcomeMessage();
  const history: CalculationHistory[] = [];

  while (true) {
    showOperations();
    const choiceInput: string = await promptForOperation();
    const choice: number = parseInt(choiceInput);

    if (isNaN(choice) || choice < 1 || choice > 5) {
      console.log('Invalid choice. Please select a number between 1 and 5.');
      continue;
    }

    if (choice === OperationChoice.EXIT) {
      exitGracefully();
    }

    const operand1 = await getNumberInput('Enter first number: ');
    const operand2 = await getNumberInput('Enter second number: ');
    let result: number;

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
    } catch (error: unknown) {
      handleCalculationError(error as Error);
    }
  }
}

mainMenuLoop();
