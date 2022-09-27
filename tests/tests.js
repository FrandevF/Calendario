const modalBtn = document.querySelector(".modalBtn");

modalBtn.addEventListener("click", () => {
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  const ocult = document.querySelector(".ocultBeforeModal");
  ocult.classList.add("ocult");
});
const gridContainer = document.querySelector(".grid-container");
const form = document.querySelector(".form");
function makeInputsToGrid() {
  for (let i = 0; i < 70; i++) {
    const input = document.createElement("input");

    input.classList.add("day");
    input.classList.add("inputSubjects");
    input.setAttribute("type", "text");
    input.setAttribute("id", "addYourSubject");
    input.setAttribute("name", "name");
    input.setAttribute("placeholder", "Add your subject");
    // input.setAttribute("value", "XDDDD");
    form.appendChild(input);
    gridContainer.appendChild(input);
  }

  const button1 = document.createElement("button");
  button1.textContent = "Add";
  button1.classList.add("btn-oculto");
  button1.classList.add("addYourSubject");
  const buttonSave = document.createElement("button");
  buttonSave.textContent = "Save Calendar";
  buttonSave.classList.add("btn-oculto");
  buttonSave.setAttribute("id", "saveCalendar");
  form.appendChild(button1);
  form.appendChild(buttonSave);
  gridContainer.appendChild(form);
}
makeInputsToGrid();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = document.querySelectorAll("#addYourSubject");

  data.forEach((item) => {
    const valor = { materia: item.value };
    if (item.value !== "") {
      console.log(valor);
      addObject(valor);
    } else {
      console.log("No hay datos");
    }
  });
  const inputSubjects = document.querySelectorAll(".inputSubjects");
  inputSubjects.forEach((item) => {
    if (item.value !== "") {
      item.setAttribute("readonly", "readonly");
    }
  });
});
//hacer que si ya se guardó el calendario, al cargar la página se muestre el calendario guardado---ARREGLAR
const ocult = document.querySelector(".ocultBeforeModal");

document.addEventListener("DOMContentLoaded", function () {
  if (calendarSaved === true) {
    ocult.classList.add("ocult");
    alert("Calendar saved");
  }
});

//OCULTAR "CREA TU PROPIO CALENDARIO"

const saveCalendarButton = document.getElementById("saveCalendar");
saveCalendarButton.addEventListener("click", (e) => {
  e.preventDefault();
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");

  // ocult.classList.remove("ocult");
  showCalendar();
});
let calendarSaved = false;

//configs

// Mostrar calendario creado
function showCalendar() {
  calendarSaved = true;
  const saveArr = [];
  saveArr.push(JSON.stringify(calendarSaved));
  addObject(saveArr);
  const gridContainer2 = document.querySelector(".grid-container2");
  const showCalendar = document.getElementById("showCalendar");
  showCalendar.classList.remove("hidden");
  const form2 = document.querySelector(".form2");
  gridContainer.style.display = "none";
  form.style.display = "none";

  for (let i = 0; i < 70; i++) {
    const input2 = document.createElement("input");
    input2.classList.add("day");
    input2.classList.add("inputSubjectsSaved");
    input2.setAttribute("type", "text");
    input2.setAttribute("id", "addYourSubject");
    input2.setAttribute("name", "name");

    input2.setAttribute("value", "");

    form2.appendChild(input2);
    gridContainer2.appendChild(input2);
    input2.setAttribute("readonly", "readonly");
  }

  gridContainer2.appendChild(form);

  consult().then((data) => {
    const inputSubjectsSaved = document.querySelectorAll(".inputSubjectsSaved");
    const input = document.querySelectorAll(".inputSubjects");

    input.forEach((item, index) => {
      if (item.value !== "") {
        inputSubjectsSaved[index].setAttribute("value", item.value);
      }
      if (item.value === "") {
        inputSubjectsSaved[index].setAttribute("value", "");
        inputSubjectsSaved[index].classList.add("voidday");
      }
    });
    calendarSaved = true;
  });
}

// const arr = JSON.stringify(data);
// const arr2 = JSON.parse(arr);
// console.log(arr);
// console.log(arr2);

// CRUD
const IDBRequest = indexedDB.open("CalendarDB", 1);

let db;
IDBRequest.onsuccess = () => {
  db = IDBRequest.result;
  console.log("Database opened successfully", db);
};
IDBRequest.onupgradeneeded = (e) => {
  db = e.target.result;
  console.log("Database created and upgraded successfully", db);
  const objectStore = db.createObjectStore("Lista de asignaturas", {
    autoIncrement: true,
    keyPath: "id",
  });
};

//ADD OBJECT TO DATABASE
const addObject = (Subject) => {
  const transaction = db.transaction(["Lista de asignaturas"], "readwrite");
  const objectColeccion = transaction.objectStore("Lista de asignaturas");
  const request = objectColeccion.add(Subject);
  consult();
};
//READ OBJECT FROM DATABASE
const readObject = (key) => {
  const transaction = db.transaction(["Lista de asignaturas"], "readonly");
  const objectColeccion = transaction.objectStore("Lista de asignaturas");
  const request = objectColeccion.get(key);
  request.onsuccess = (e) => {
    console.log(e.target.result);
  };
};

//UPDATE OBJECT FROM DATABASE
const updateObject = (data) => {
  const transaction = db.transaction(["Lista de asignaturas"], "readwrite");
  const objectColeccion = transaction.objectStore("Lista de asignaturas");
  const request = objectColeccion.put(data);

  request.onsuccess = (e) => {
    consult();
  };
};

//DELETE OBJECT FROM DATABASE
const deleteObject = (key) => {
  const transaction = db.transaction(["Lista de asignaturas"], "readwrite");
  const objectColeccion = transaction.objectStore("Lista de asignaturas");
  const request = objectColeccion.delete(key);

  request.onsuccess = (e) => {
    consult();
  };
  console.log("deleted successfully");
};

//consultar
const consult = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Lista de asignaturas"], "readwrite");
    const objectColeccion = transaction.objectStore("Lista de asignaturas");
    var myArray = [];
    objectColeccion.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        myArray.push(cursor.value);
        cursor.continue();
      } else {
        resolve(myArray);
      }
    };
  });
};
