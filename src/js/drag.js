import { saveState } from "./storage.js";

let actualElement;
let offsetX;
let offsetY;
let insertIndicator;
let insertAfter;
let insertPlace;
let targetList;

const onMouseMove = (e) => {
  if (actualElement) {
    const deltaX = e.clientX - offsetX;
    const deltaY = e.clientY - offsetY;
    actualElement.style.top = deltaY + "px";
    actualElement.style.left = deltaX + "px";

    if (insertIndicator.style.display !== "block") {
      insertIndicator.style.display = "block";
    }

    targetList = e.target.closest(".issue-list");
    const row = e.target.closest(".issue-row");
    if (row) {
      const mouseY = e.clientY;

      const rect = row.getBoundingClientRect();
      insertAfter = row;
      insertPlace =
        mouseY < (rect.bottom - rect.top) / 2 + rect.top ? "Before" : "After";
      // }

      if (targetList && insertAfter && targetList.contains(insertAfter)) {
        insertIndicator.style.height = `${actualElement.offsetHeight}px`;

        if (insertPlace === "Before") {
          targetList.insertBefore(insertIndicator, insertAfter);
        } else {
          targetList.insertBefore(insertIndicator, insertAfter.nextSibling);
        }
      }
    }
  }
};

const onMouseUp = () => {
  if (!actualElement) return;

  if (insertAfter) {
    if (insertPlace === "Before") {
      targetList.insertBefore(actualElement, insertAfter);
    } else {
      targetList.insertBefore(actualElement, insertAfter.nextSibling);
    }
  }

  insertIndicator.style.display = "none";
  const boardCanvas = document.querySelector(".board-canvas");
  boardCanvas.insertBefore(insertIndicator, boardCanvas.lastChild);

  actualElement.style.top = "";
  actualElement.style.left = "";
  actualElement.classList.remove("dragged");
  actualElement.style.width = "";
  actualElement.style.height = "";

  document.body.style.cursor = "";

  actualElement = undefined;

  saveState();

  document.documentElement.removeEventListener("mousemove", onMouseMove);
  document.documentElement.removeEventListener("mouseup", onMouseUp);
};

const onMouseDown = (e) => {
  if (e.target.classList.contains("delete-card")) {
    return;
  }

  insertAfter = null;
  insertPlace = null;

  actualElement = e.currentTarget;
  actualElement.classList.add("dragged");

  document.body.style.cursor = "grabbing";

  actualElement.style.width = `${actualElement.offsetWidth}px`;
  actualElement.style.height = `${actualElement.offsetHeight}px`;

  const rect = actualElement.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  if (!insertIndicator) {
    insertIndicator = document.createElement("div");
    insertIndicator.className = "issue-row insert-indicator";
    document.body.appendChild(insertIndicator);
  }

  document.documentElement.addEventListener("mousemove", onMouseMove);
  document.documentElement.addEventListener("mouseup", onMouseUp);
};

export const enableDragAndDrop = () => {
  document.querySelectorAll(".issue-row").forEach((row) => {
    row.addEventListener("mousedown", onMouseDown);
  });
};
