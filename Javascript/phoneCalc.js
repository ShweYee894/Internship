let currentInput = "";
let operation = "";
let previousInput = "";

// Select all number buttons using a class
const numberButtons = document.querySelectorAll(".inputNumberBtn");
const operationButtons = document.querySelectorAll(".operatorBtn");
const equalButton = document.getElementById("equalBtn");
const clearButton = document.getElementById("clearBtn");
const deleteButton = document.getElementById("deleteBtn");

function appendNumber(num) {
  if (num === "." && currentInput.includes(".")) return;
  currentInput += num;
  updateDisplay();
}

function appendOperation(op) {
  if (currentInput === "") return;
  if (previousInput !== "") {
    calculate();
  }
  operation = op;
  previousInput = currentInput;
  currentInput = "";
  updateDisplay();
}

function calculate() {
  if (previousInput === "" || currentInput === "") return;
  let result;
  let num1 = parseFloat(previousInput);
  let num2 = parseFloat(currentInput);

  switch (operation) {
    case "+":
      result = num1 + num2;
      break;
    case "-":
      result = num1 - num2;
      break;
    case "*":
      result = num1 * num2;
      break;
    case "/":
      if (num2 === 0) {
        alert("Cannot divide by zero");
        clear();
        return;
      }
      result = num1 / num2;
      break;
    default:
      return;
  }

  currentInput = result.toString();
  operation = "";
  previousInput = "";
  updateDisplay();
}

function updateDisplay() {
  const displayResult = document.getElementById("inputText");
  displayResult.value = `${previousInput} ${operation} ${currentInput}`.trim(); // remove white space in both side
}

function clear() {
  currentInput = "";
  previousInput = "";
  operation = "";
  document.getElementById("inputText").value = 0;
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

// Event Listeners for each button click
numberButtons.forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.innerText));
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => appendOperation(button.innerText));
});

equalButton.addEventListener("click", calculate);
clearButton.addEventListener("click", clear);
deleteButton.addEventListener("click", deleteLast);
