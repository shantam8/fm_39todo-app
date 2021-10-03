let body = document.querySelector("body");
let btnToggleTheme = document.querySelector("#btnToggleTheme");
let btnsFunctionBar = document.querySelectorAll("#listFunctionsBox button");

let inputItem = document.querySelector("#inputItem");
let btnInputItemCompleted = document.querySelector("#btnInputItemCompleted");

let listBoxUlContainer = document.getElementById("listBoxUlContainer");
let listItems = document.getElementsByClassName("listItem");
let btnsToggleItemCompleted = document.getElementsByClassName("btn_listCircle");

let numberItemsLeft = document.querySelector("#numberItemsLeft");

let itemListArray = ["123", "456", "789"];

function toggleColorTheme() {
  body.classList.toggle("darkTheme");
}

function toggleShowElements(event) {
  console.log(event.target);

  btnsFunctionBar.forEach((button) => {
    button.classList.remove("functionActive");
  });
  event.target.classList.add("functionActive");
  console.log(typeof listItems);

  for (let i = 0; i < listItems.length; i++) {
    listItems[i].style.display = "flex";
  }

  let counter = 0;
  if (event.target.value == "showActive") {
    for (let i = 0; i < listItems.length; i++) {
      if (listItems[i].classList.contains("itemCompleted")) {
        listItems[i].style.display = "none";
      } else {
        counter++;
      }
    }
    displayNumberItemsLeft(counter);
  } else if (event.target.value == "showCompleted") {
    for (let i = 0; i < listItems.length; i++) {
      if (!listItems[i].classList.contains("itemCompleted")) {
        listItems[i].style.display = "none";
      } else {
        counter++;
      }
    }
    displayNumberItemsLeft(counter);
  }
}





function toggleItemCompleted(event) {
  console.log(event.target.parentElement);

  event.target.parentElement.classList.toggle("itemCompleted");
}

function addItemHandler(event) {
  let doubleEntry = false;
  itemListArray.forEach((item) => {
    if (item == inputItem.value) {
      console.log("gibbet schon");
      doubleEntry = true;
      return;
    }
  });
  if (doubleEntry) {
    inputItem.value = "";
    return;
  }

  itemListArray.push(inputItem.value);
  saveListToLocalStorage();
  console.log(itemListArray);
  listBoxUlContainer.appendChild(createListElement(inputItem.value));
  displayNumberItemsLeft();
  inputItem.value = "";
}

function displayList() {
  itemListArray.forEach((item) => {
    listBoxUlContainer.appendChild(createListElement(item));
  });
  displayNumberItemsLeft();
}

function createListElement(item) {
  let newLiElement = document.createElement("li");
  let newButtonListCircleElement = document.createElement("button");
  let newListTextElement = document.createElement("p");
  let newButtonRemoveItemElement = document.createElement("button");

  newLiElement.classList.add("listItem");
  newButtonListCircleElement.classList.add("btn_listCircle");
  newButtonListCircleElement.addEventListener("click", toggleItemCompleted);
  newListTextElement.classList.add("listText");
  newListTextElement.innerText = item;
  newButtonRemoveItemElement.classList.add("btn_removeItem");
  newButtonRemoveItemElement.addEventListener("click", removeListItem);

  newLiElement.appendChild(newButtonListCircleElement);
  newLiElement.appendChild(newListTextElement);
  newLiElement.appendChild(newButtonRemoveItemElement);

  return newLiElement;
}

function removeListItem(event) {
  event.target.previousSibling.previousSibling.removeEventListener(
    "click",
    toggleItemCompleted
  );
  event.target.removeEventListener("click", removeListItem);
  event.target.parentElement.remove();

  itemListArray = itemListArray.filter((value) => {
    if (value != event.target.previousSibling.innerText) {
      return value;
    }
  });
  displayNumberItemsLeft();
  saveListToLocalStorage();
}

function displayNumberItemsLeft(numberItemsDisplayed) {
  if (numberItemsDisplayed) {
    numberItemsLeft.innerText = numberItemsDisplayed;
  } else {
    numberItemsLeft.innerText = itemListArray.length;
  }
}

function saveListToLocalStorage() {
  window.localStorage.setItem("ToDo-list", itemListArray);
}

function init() {
  displayList();

  btnToggleTheme.addEventListener("click", toggleColorTheme);

  inputItem.addEventListener("change", addItemHandler);
  btnsFunctionBar.forEach((button) => {
    button.addEventListener("click", toggleShowElements);
  });
}

window.onload = init;
