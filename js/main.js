let body = document.querySelector("body");
let btnToggleTheme = document.querySelector("#btnToggleTheme");
let btnsFunctionBar = document.querySelectorAll("#listFunctionsBox button");
let activeFunction = "showAll";

let inputItem = document.querySelector("#inputItem");
let btnInputItemCompleted = document.querySelector("#btnInputItemCompleted");

let listBoxUlContainer = document.getElementById("listBoxUlContainer");
let listItems = document.getElementsByClassName("listItem");
let btnsToggleItemCompleted = document.getElementsByClassName("btn_listCircle");
let btnClearCompleted = document.querySelector("#btn_clear");

let numberItemsLeft = document.querySelector("#numberItemsLeft");

let itemListArray = [];
let itemDragSelectedFrom;
let itemDropSelectedTo;
const offsetY = 178;

function toggleColorTheme() {
  body.classList.toggle("darkTheme");
}

function toggleShowElements(event) {
  btnsFunctionBar.forEach((button) => {
    button.classList.remove("functionActive");
  });
  event.target.classList.add("functionActive");

  if (event.target.value == "showActive") {
    activeFunction = "showActive";
  } else if (event.target.value == "showCompleted") {
    activeFunction = "showCompleted";
  } else {
    activeFunction = "showAll";
  }
  displayList();
}

function displayList() {
  for (let i = 0; i < listItems.length; i++) {
    listItems[i].style.display = "flex";
  }
  let counter = 0;

  switch (activeFunction) {
    case "showAll":
      displayNumberItemsLeft();

      break;
    case "showActive":
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].classList.contains("itemCompleted")) {
          listItems[i].style.display = "none";
        } else {
          counter++;
        }
      }
      console.log("active " + counter);

      displayNumberItemsLeft(counter);
      break;

    case "showCompleted":
      for (let i = 0; i < listItems.length; i++) {
        if (!listItems[i].classList.contains("itemCompleted")) {
          listItems[i].style.display = "none";
        } else {
          counter++;
        }
      }
      displayNumberItemsLeft(counter);
      break;
  }
}

function displayNumberItemsLeft(numberItemsDisplayed) {
  if (numberItemsDisplayed != null) {
    numberItemsLeft.innerText = numberItemsDisplayed;
  } else {
    numberItemsLeft.innerText = itemListArray.length;
  }
}

function addItemHandler() {
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
  listBoxUlContainer.appendChild(createListElement(inputItem.value));
  saveListToLocalStorage();
  displayList();
  inputItem.value = "";
}

function handleClearCompleted() {
  for (let i = listItems.length - 1; i >= 0; i--) {
    if (listItems[i].classList.contains("itemCompleted")) {
      listItems[i].lastChild.click();
    }
  }
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
  displayList();
  saveListToLocalStorage();
}

function toggleItemCompleted(event) {
  event.target.parentElement.classList.toggle("itemCompleted");
  displayList();
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

  newLiElement.setAttribute("draggable", true);
  newLiElement.addEventListener("dragstart", handleDragStart);

  return newLiElement;
}

function handleDragStart(event) {
  itemDragSelectedFrom = event.target.children[1].innerText;
}

function handleDragLeave(event) {
  event.target.closest(".listItem").classList.remove("dragBorderBottom");
  event.target.closest(".listItem").classList.remove("dragBorderTop");
}

function handleDragOver(event) {
  event.preventDefault();
  //console.log(event);

  if (calculatePositionUponItem(event) == "Top") {
    event.target.closest(".listItem").classList.remove("dragBorderBottom");
    event.target.closest(".listItem").classList.add("dragBorderTop");
  } else if (calculatePositionUponItem(event) == "Bottom") {
    event.target.closest(".listItem").classList.remove("dragBorderTop");
    event.target.closest(".listItem").classList.add("dragBorderBottom");
  }
}

function handleDrop(event) {
  event.preventDefault();
  event.target.closest(".listItem").classList.remove("dragBorderBottom");
  event.target.closest(".listItem").classList.remove("dragBorderTop");
  itemDropSelectedTo = event.target.closest(".listItem").children[1].innerText;
  moveItem(calculatePositionUponItem(event));
}

function calculatePositionUponItem(item) {
  let itemOffsetY = item.clientY - offsetY;
  itemOffsetY = itemOffsetY % 53;
  //console.log(itemOffsetY);
  if (itemOffsetY > 0 && itemOffsetY <= 26.5) {
    return "Top";
  } else if (itemOffsetY > 26.5 && itemOffsetY <= 52) {
    return "Bottom";
  }
}

function moveItem(position) {
  console.log("move");

  console.log(itemListArray);

  if (position == "Top") {
    console.log(position);

    moveItemIndexCalculation(0);
  } else if (position == "Bottom") {
    console.log(position);

    moveItemIndexCalculation(1);
  }

  console.log(itemListArray);

  saveListToLocalStorage();

  listBoxUlContainer.innerHTML = "";
  createListOnStart();
  displayList();
}

function moveItemIndexCalculation(indexOffset) {
  if (
    // downwards
    itemListArray.indexOf(itemDropSelectedTo) >
    itemListArray.indexOf(itemDragSelectedFrom)
  ) {
    itemListArray.splice(
      itemListArray.indexOf(itemDropSelectedTo) + indexOffset,
      0,
      itemDragSelectedFrom
    );
    itemListArray.splice(itemListArray.indexOf(itemDragSelectedFrom), 1);
  } else {
    // upwards
    itemListArray.splice(itemListArray.indexOf(itemDragSelectedFrom), 1);
    itemListArray.splice(
      itemListArray.indexOf(itemDropSelectedTo) + indexOffset,
      0,
      itemDragSelectedFrom
    );
  }
}

function saveListToLocalStorage() {
  window.localStorage.setItem("ToDo-list", itemListArray);
}

function loadListFromLocalStorage() {
  if (window.localStorage.getItem("ToDo-list")) {
    itemListArray = window.localStorage.getItem("ToDo-list").split(",");
  }
}

function createListOnStart() {
  itemListArray.forEach((item) => {
    listBoxUlContainer.appendChild(createListElement(item));
  });
}

function init() {
  loadListFromLocalStorage();
  createListOnStart();
  displayList();

  btnToggleTheme.addEventListener("click", toggleColorTheme);

  inputItem.addEventListener("change", addItemHandler);
  btnsFunctionBar.forEach((button) => {
    button.addEventListener("click", toggleShowElements);
  });

  btnClearCompleted.addEventListener("click", handleClearCompleted);

  listBoxUlContainer.addEventListener("drop", handleDrop);
  listBoxUlContainer.addEventListener("dragover", handleDragOver);
  listBoxUlContainer.addEventListener("dragleave", handleDragLeave);
}

window.onload = init;
