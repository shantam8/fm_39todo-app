let body = document.querySelector("body");
let btnToggleTheme = document.querySelector("#btnToggleTheme");
let btnsFunctionBar = document.querySelectorAll("#listFunctionsBox button");

let listItems = document.getElementsByClassName("listItem");
let btnsToggleItemCompleted = document.getElementsByClassName("btn_listCircle");

function toggleColorTheme() {
  body.classList.toggle("darkTheme");
}

function toggleShowElements(event) {
  console.log(event.target);

  btnsFunctionBar.forEach((button) => {
    button.classList.remove("functionActive");
  });
  event.target.classList.add("functionActive");
}

function toggleItemCompleted(event) {
  console.log(event.target.parentElement);

   event.target.parentElement.classList.toggle("itemCompleted");
}

function init() {
  console.log("hi");

  btnToggleTheme.addEventListener("click", toggleColorTheme);

  btnsFunctionBar.forEach((button) => {
    button.addEventListener("click", toggleShowElements);
  });

  for (let i = 0; i < btnsToggleItemCompleted.length; i++) {
    btnsToggleItemCompleted[i].addEventListener("click", toggleItemCompleted);
  }
}

window.onload = init;
