let currentInput = "";
let previousInput = "";
let operator = null;

// Handles typing numbers and decimal point
function appendNumber(num) {
  if (num === "." && currentInput.includes(".")) return;

  // If a calculation just finished, start fresh
  if (currentInput === "0" && num !== ".") {
    currentInput = num.toString();
  } else {
    currentInput += num.toString();
  }
  updateDisplay(currentInput);
}

// Handles clicking +, -, *, or /
function chooseOperator(op) {
  if (currentInput === "") return;

  // If there is already a previous number, calculate intermediate result first
  if (previousInput !== "") {
    compute();
  }

  operator = op;
  previousInput = currentInput;
  currentInput = ""; // Clear current input for the next number
}

// Handles clicking Equals (=)
function compute() {
  let computation;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  if (isNaN(prev) || !operator) return;

  // If user hits '=' without typing a second number, reuse the previous number
  if (isNaN(current)) {
    computation = prev;
  } else {
    switch (operator) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = prev / current;
        break;
      default:
        return;
    }
  }

  currentInput = computation.toString();
  operator = null;
  previousInput = "";
  updateDisplay(currentInput);
}

// 4. Handles clearing the screen (AC button)
function clearAll() {
  currentInput = "";
  previousInput = "";
  operator = null;
  updateDisplay("0");
}

// delete last character

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay(currentInput || "0"); // Show 0 if currentInput is empty
}

// add event listeners to buttons

document.querySelectorAll(".inputNumberBtn").forEach(button => {
  button.addEventListener("click", () => {
    appendNumber(button.innerText);
  });
});

document.querySelectorAll(".operatorBtn").forEach(button => {
  button.addEventListener("click", () => {
    chooseOperator(button.innerText);
  });
});

document.getElementById("equalBtn").addEventListener("click", compute);
document.getElementById("clearBtn").addEventListener("click", clearAll);
document.getElementById("deleteBtn").addEventListener("click", deleteLast);
