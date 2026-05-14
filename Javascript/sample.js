const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

let input = [];
let justCalculated = false;

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.value;

    if (value === "C") {
      input = [];
      updateDisplay("");
      return;
    }

    if (value === "backspace") {
      backspace();
      updateDisplay();
      return;
    }

    if (value === "=") {
      if (input.length === 0) return;

      const result = calculate([...input]);

      // SHOW ORIGINAL + RESULT
      updateDisplay(result);

      // clear input and show result after each calculation
      justCalculated = true;
      return;
    }

    if (value === "%") {
      handleInput("%");
      updateDisplay();
      return;
    }

    if (value === "brackets") {
      handleInput("brackets");
      updateDisplay();
      return;
    }
    handleInput(value);
    updateDisplay();
  });
});

function updateDisplay(result = "") {
  expressionDisplay.innerText = input.join("");
  resultDisplay.innerText = result ? "\n= " + result : "";
}

//input handler for numbers, operators, brackets, decimal and percentage

function handleInput(value) {
  const operators = ["+", "-", "×", "÷", "%"];
  const last = input[input.length - 1];

  if (justCalculated) {
    input = [];

    updateDisplay();

    justCalculated = false;
  }

  // decimal
  if (value === ".") {
    if (!last || operators.includes(last) || last === "(") {
      input.push("0.");
    } else if (!last.includes(".")) {
      input[input.length - 1] += ".";
    }
    return;
  }

  // percentage
  if (value === "%") {
    const last = input[input.length - 1];

    if (!last || isNaN(last)) return;

    input.push("%");

    return;
  }

  // operators
  if (operators.includes(value)) {
    if (operators.includes(last)) {
      input[input.length - 1] = value;
    } else {
      input.push(value);
    }
    return;
  }

  // brackets
  if (value === "brackets") {
    const last = input[input.length - 1];
    const openCount = input.filter((x) => x === "(").length;
    const closeCount = input.filter((x) => x === ")").length;

    // CASE 1: EMPTY INPUT → always open bracket
    if (input.length === 0) {
      input.push("(");
      return;
    }

    // CASE 2: last is operator OR "(" → open bracket
    if (!last || ["+", "-", "×", "÷", "("].includes(last)) {
      input.push("(");
      return;
    }

    // CASE 3: if brackets are unbalanced → close bracket
    if (openCount > closeCount) {
      input.push(")");
      return;
    }

    if (value === ")") {
      input.push(")");

      return;
    }
    // DEFAULT → open bracket
    input.push("(");
    return;
  }

  //numbers;
  if (!isNaN(value)) {
    if (!last || operators.includes(last) || last === "(") {
      input.push(value);
    } else {
      input[input.length - 1] += value;
    }
  }
}

//backspace handler

function backspace() {
  const last = input[input.length - 1];

  if (!last) return;

  if (last.length > 1) {
    input[input.length - 1] = last.slice(0, -1);
  } else {
    input.pop();
  }
}

// Function to handle implicit multiplication and evaluate the expression e.g 2(3+4) or (2+3)(4+5) or 2(3)(4) etc.
function calculateImplicit(expr) {
  // Replace 2( with 2*(, )2 with )*2, and )( with )*(
  let cleanedExpr = expr
    .replace(/(\d)\(/g, "$1*(")
    .replace(/\)(\d)/g, ")*$1")
    .replace(/\)\(/g, ")*(");

  try {
    return Function('"use strict";return (' + cleanedExpr + ")")();
  } catch (e) {
    return "Invalid Expression";
  }
}

// calculation logic for operator precedence, brackets and percentage

function calculate(arr) {
  // 1. Join the array to inspect the full string expression
  const fullExpr = arr.join("");

  // 2. Check if the expression contains implicit multiplication like "2(" or ")2" or ")("
  const hasImplicit = /(\d)\(|\)(\d)|\)\(/.test(fullExpr);

  if (hasImplicit) {
    // Return the single numeric value from the implicit calculator
    return calculateImplicit(fullExpr);
  } else {
    // Otherwise, return the single numeric value from your standard tokenizer solver
    return solve(arr);
  }

  function solve(tokens) {
    // Clone tokens so we don't destroy the original array
    let currentTokens = [...tokens];
    const values = [];
    const ops = [];

    const precedence = {
      "+": 1,
      "-": 1,
      "×": 2,
      "÷": 2,
      "()": 3,
    };

    function applyOp() {
      if (values.length < 2) return;
      const num2 = values.pop(); // Note: Pop num2 first because it's LIFO
      const num1 = values.pop();
      const op = ops.pop();

      switch (op) {
        case "+":
          values.push(num1 + num2);
          break;
        case "-":
          values.push(num1 - num2);
          break;
        case "×":
          values.push(num1 * num2);
          break;
        case "÷":
          values.push(num1 / num2);
          break;
      }
    }

    while (currentTokens.length) {
      let token = currentTokens.shift();

      if (token === "%") {
        const prev = values.pop();
        values.push(prev / 100);
        continue;
      }

      if (token === "(") {
        let sub = [];
        let depth = 1;

        while (currentTokens.length) {
          let t = currentTokens.shift();
          if (t === "(") depth++;
          if (t === ")") depth--;
          if (depth === 0) break;
          sub.push(t);
        }

        values.push(solve(sub));
      } else if (!isNaN(token) && token !== "") {
        values.push(parseFloat(token));
      } else {
        while (
          ops.length &&
          precedence[ops[ops.length - 1]] >= precedence[token]
        ) {
          applyOp();
        }
        ops.push(token);
      }
    }

    while (ops.length) applyOp();

    return values[0];
  }
}

//keyboard support for inputs and operations

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key >= "0" && key <= "9") {
    handleInput(key);
  }

  if (key === "+") handleInput("+");
  if (key === "-") handleInput("-");
  if (key === "*") handleInput("×");
  if (key === "/") handleInput("÷");
  if (key === ".") handleInput(".");
  if (key === "%") handleInput("%");
  if (key === "=") handleInput("=");

  if (key === "Backspace") {
    backspace();
  }

  if (key === "Escape") {
    input = [];
    updateDisplay("");
  }

  updateDisplay();
});
