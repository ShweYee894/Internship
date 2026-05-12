let firstInputNum = "";
let operation = "";
let nextInputNum = "";

// Select all number buttons using a class
const numberButtons = document.querySelectorAll(".inputNumberBtn");
const operationButtons = document.querySelectorAll(".operatorBtn");
const equalButton = document.getElementById("equalBtn");
const clearButton = document.getElementById("clearBtn");
const deleteButton = document.getElementById("deleteBtn");

function appendNumber(num) {
  firstInputNum += num;
  updateDisplay();
}

function appendOperation(op) {
  if (firstInputNum === "") return;
  if (nextInputNum !== "") {
    calculate();
  }
  operation = op;
  nextInputNum = firstInputNum;
  firstInputNum = "";
  updateDisplay();
}

function calculate() {
  if (nextInputNum === "" || firstInputNum === "") return;
  let result;
  let num1 = parseFloat(nextInputNum);
  let num2 = parseFloat(firstInputNum);

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

  firstInputNum = result.toString();
  operation = "";
  nextInputNum = "";
  updateDisplay();
}

function updateDisplay() {
  const displayResult = document.getElementById("inputText");
  displayResult.value = `${nextInputNum} ${operation} ${firstInputNum}`.trim(); // remove white space in both side
}

function clear() {
  firstInputNum = "";
  nextInputNum = "";
  operation = "";
  document.getElementById("inputText").value = 0;
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
