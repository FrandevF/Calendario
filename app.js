const formUI = document.querySelector("#form");
const activityListUI = document.querySelector("#activityList");
let arrayActivities = [];

//CREATE ITEM
const createItem = (activity) => {
  let item = {
    activity: activity,
    status: false,
  };
  arrayActivities.push(item);
  return item;
};

let run = createItem("run");
let eat = createItem("eat");
console.log(run);
console.log(arrayActivities);

//SAVE ITEM

const saveDB = () => {
  localStorage.setItem("activities", JSON.stringify(arrayActivities));
};

//REMOVE ITEM

//Button submit detection

formUI.addEventListener("submit", (e) => {
  e.preventDefault();
  let activityUI = document.querySelector("#activity").value;

  createItem(activityUI);
  saveDB();
  formUI.reset(); //reset formInput
});

//MODAL
const materias = document.querySelectorAll(".day");

materias.forEach((materia) => {
  const modal = document.querySelector("#modal-container");
  materia.addEventListener("click", () => {
    modal.style.visibility = "visible";
  });

  const close = document.querySelector(".closeModal");
  close.addEventListener("click", () => {
    modal.style.visibility = "hidden";
  });
});

//CRUD
const IDBRequest = indexedDB.open("franDataBase", 1);
IDBRequest.onupgradeneeded = function (event) {
  const db = IDBRequest.result;
  db.createObjectStore("franStore", {
    autoIncrement: true,
  });
};

IDBRequest.onsuccess = function (event) {
  readObject();
};

document.querySelector(".btn-task").addEventListener("click", () => {
  let task = document.getElementById("taskInput").value;
  if (task.length > 0) {
    if (document.querySelector(".posible") != undefined) {
      if (
        confirm(
          " There is a name that has not been saved, do you want to save it?"
        )
      ) {
        addObject({ task });
        readObject();
      }
    } else {
      addObject({ task });
      readObject();
    }
  }
});

//ADD OBJECT TO DATABASE
const addObject = (object) => {
  const IDBData = transactionOperation("readwrite", "object added");
  IDBData.add(object);
};
//READ OBJECT FROM DATABASE
const readObject = () => {
  const IDBData = transactionOperation("readonly");
  const cursor = IDBData.openCursor();
  const fragment = document.createDocumentFragment();
  document.querySelector(".tasks").innerHTML = "";
  cursor.addEventListener("success", () => {
    // if (cursor.result) {
    //   let element = namesHTML(cursor.result.key, cursor.result.value);
    //   fragment.appendChild(element);
    //   cursor.result.continue();
    // } else document.querySelector(".tasks").appendChild(fragment);
  });
};
//MODIFY OBJECT FROM DATABASE
const modifyObject = (key, object) => {
  const IDBData = transactionOperation("readwrite", "object modified");
  IDBData.put(object, key);
};
//DELETE OBJECT FROM DATABASE
const deleteObject = (key) => {
  const IDBData = transactionOperation("readwrite", "object deleted");
  IDBData.delete(key);
};
//GET DATABASE AND TRANSACTION
const transactionOperation = (mode, msg) => {
  const db = IDBRequest.result;
  const IDBtransaction = db.transaction(["franStore"], mode);
  const objectStore = IDBtransaction.objectStore("franStore");
  IDBtransaction.addEventListener("complete", () => {
    console.log(msg);
  });
  return objectStore;
};

// const namesHTML = (id, name) => {
//   const container = document.createElement("DIV");
//   const h2 = document.createElement("h2");
//   const options = document.createElement("DIV");
//   const saveButton = document.createElement("button");
//   const deleteButton = document.createElement("button");

//   container.classList.add("name");
//   options.classList.add("options");
//   saveButton.classList.add("imposible");
//   deleteButton.classList.add("delete");

//   saveButton.textContent = "Save";
//   deleteButton.textContent = "Delete";
//   h2.textContent = name.name;

//   h2.setAttribute("contenteditable", "true");
//   h2.spellcheck = false;

//   options.appendChild(saveButton);
//   options.appendChild(deleteButton);

//   container.appendChild(h2);
//   container.appendChild(options);

//   h2.addEventListener("keyup", () => {
//     saveButton.classList.replace("imposible", "posible");
//   });

//   saveButton.addEventListener("click", () => {
//     if (saveButton.classList.contains("posible")) {
//       modifyObject(id, { name: h2.textContent });
//       saveButton.classList.replace("posible", "imposible");
//     }
//   });

//   deleteButton.addEventListener("click", () => {
//     let confirmDelete = confirm("Are you sure you want to delete this task?");
//     if (confirmDelete) {
//       deleteObject(id);
//       document.querySelector(".names").removeChild(container);
//     }
//   });

//   return container;
// };
