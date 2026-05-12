// select all input button values

const numberButtons = document.querySelectorAll(".inputNumberBtn");
const operationButtons = document.querySelectorAll(".operatorBtn");
const clearButton = document.getElementById("clearBtn");
const deleteButton = document.getElementById("deleteBtn");
const equalButton = document.getElementById("equalBtn");

//call btn functions
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appendNumber(button.innerText);
  });
});
