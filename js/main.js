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
let offsetY = 0;

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
    if (item.text == inputItem.value) {
      console.log("gibbet schon");
      doubleEntry = true;
      return;
    }
  });
  if (doubleEntry) {
    inputItem.value = "";
    return;
  }
  listBoxUlContainer.appendChild(createListElement(inputItem.value));
  itemListArray.push({ text: inputItem.value, completed: false });

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
    if (value.text != event.target.previousSibling.innerText) {
      return value;
    }
  });
  displayList();
  saveListToLocalStorage();
}

function toggleItemCompleted(event) {
  event.target.parentElement.classList.toggle("itemCompleted");
  displayList();

  itemListArray.forEach((item) => {
    if (event.target.nextSibling.innerText == item.text) {
      item.completed = !item.completed;
      saveListToLocalStorage();
    }
  });
}

function createListElement(item, completed) {
  let newLiElement = document.createElement("li");
  let newButtonListCircleElement = document.createElement("button");
  let newListTextElement = document.createElement("p");
  let newButtonRemoveItemElement = document.createElement("button");

  newLiElement.classList.add("listItem");
  if (completed) {
    newLiElement.classList.add("itemCompleted");
  }

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
  if (event.target.closest(".listItem").previousElementSibling) {
    event.target
      .closest(".listItem")
      .previousElementSibling.classList.remove("borderBottomNone");
  }
  event.target.closest(".listItem").classList.remove("dragBorderBottom");
  event.target.closest(".listItem").classList.remove("dragBorderTop");
}

function handleDragOver(event) {
  event.preventDefault();

  console.log(event.clientY);

  if (calculatePositionUponItem(event) == "Top") {
    if (event.target.closest(".listItem").previousElementSibling) {
      event.target
        .closest(".listItem")
        .previousElementSibling.classList.add("borderBottomNone");
    }
    event.target.closest(".listItem").classList.remove("dragBorderBottom");
    event.target.closest(".listItem").classList.add("dragBorderTop");
  } else if (calculatePositionUponItem(event) == "Bottom") {
    if (event.target.closest(".listItem").previousElementSibling) {
      event.target
        .closest(".listItem")
        .previousElementSibling.classList.remove("borderBottomNone");
    }
    event.target.closest(".listItem").classList.remove("dragBorderTop");
    event.target.closest(".listItem").classList.add("dragBorderBottom");
  }
}

function handleDrop(event) {
  event.preventDefault();
  event.target.closest(".listItem").classList.remove("dragBorderBottom");
  event.target.closest(".listItem").classList.remove("dragBorderTop");
  itemDropSelectedTo = event.target.closest(".listItem").children[1].innerText;

  if (itemDropSelectedTo == itemDragSelectedFrom) {
    return;
  }
  moveItem(calculatePositionUponItem(event));
}

function calculatePositionUponItem(item) {
  let itemOffsetY = item.clientY - offsetY;
  itemOffsetY = itemOffsetY % 53;
  if (itemOffsetY > 0 && itemOffsetY <= 26.5) {
    return "Top";
  } else if (itemOffsetY > 26.5 && itemOffsetY <= 52) {
    return "Bottom";
  }
}

function moveItem(position) {
  if (position == "Top") {
    moveItemIndexCalculation(0);
  } else if (position == "Bottom") {
    moveItemIndexCalculation(1);
  }

  console.log(itemListArray);

  saveListToLocalStorage();

  listBoxUlContainer.innerHTML = "";
  console.log(itemListArray);

  createListOnStart();
  displayList();
}

function moveItemIndexCalculation(indexOffset) {
  let tmpIndexTo, tmpIndexFrom;

  itemListArray.map((item, index) => {
    if (itemDropSelectedTo == item.text) {
      tmpIndexTo = index;
    }
    if (itemDragSelectedFrom == item.text) {
      tmpIndexFrom = index;
    }
  });

  if (tmpIndexTo > tmpIndexFrom) {
    // downwards

    itemListArray.splice(
      tmpIndexTo + indexOffset,
      0,
      itemListArray[tmpIndexFrom]
    );

    itemListArray.splice(tmpIndexFrom, 1);
  } else {
    // upwards
    console.log("upwards:");

    itemListArray.splice(
      tmpIndexTo + indexOffset,
      0,
      itemListArray[tmpIndexFrom]
    );

    itemListArray.splice(tmpIndexFrom + 1, 1);
  }
}

function saveListToLocalStorage() {
  window.localStorage.setItem("ToDo-list", JSON.stringify(itemListArray));
}

function loadListFromLocalStorage() {
  if (window.localStorage.getItem("ToDo-list")) {
    itemListArray = JSON.parse(window.localStorage.getItem("ToDo-list"));
  }
}

function createListOnStart() {
  if (itemListArray.length > 0) {
    itemListArray.forEach((item) => {
      listBoxUlContainer.appendChild(
        createListElement(item.text, item.completed)
      );
    });
  }
}

function setOffset() {
  if (screen.width <= 540) {
    offsetY = 178;
  } else {
    offsetY = 224;
  }
}

function init() {
  setOffset();
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

  window.addEventListener("resize", setOffset);
}

window.onload = init;
