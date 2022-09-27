const gridContainer = document.querySelector(".grid-container");

for (let i = 0; i < 70; i++) {
  const gridItem = `<input type="text" class="day" id="addYourSubject" />`;
  gridContainer.innerHTML += gridItem;
}
