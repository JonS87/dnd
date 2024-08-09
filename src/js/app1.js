const addNewCard = document.querySelectorAll(".add-new-card");
const previewBoardState = {
  TODO: [
    "Welcome to Trello!",
    "This is a card.",
    "... or checklists.",
    "Want to use keyboard shortcuts? We have them!",
    "Click on a card to see what's behind it.",
    "... any kind of hyperlink ...",
  ],
  "IN PROGRESS": [
    "Invite your team to this board using the Add Members button",
    "Drag people onto a card to indicate that they're responsible for it",
    "Try dragging cards anywhere.",
    "Finished with a card? Archive it.",
  ],
  DONE: [
    "To learn more tricks, check out the guide",
    "Use as many boards as you want. We'll make more!",
    "Need help?",
    "Want updates on new features?",
    "Want current tips, usage examples, or API info?",
  ],
};

if (!localStorage.getItem("boardState")) {
  localStorage.setItem("boardState", JSON.stringify(previewBoardState));
}

const saveState = () => {
  const columns = document.querySelectorAll(".column");
  const boardState = {};

  columns.forEach((column) => {
    const columnName = column.querySelector(".head-name").innerText;
    const cards = Array.from(column.querySelectorAll(".issue-row")).map(
      (row) => {
        const innerText = row.querySelector(".issue-name");
        if (innerText) {
          return innerText.innerText;
        }
      },
    );
    boardState[columnName] = cards;
  });

  localStorage.setItem("boardState", JSON.stringify(boardState));
};

const loadState = () => {
  const boardState = JSON.parse(localStorage.getItem("boardState"));
  if (boardState) {
    document.querySelectorAll(".column").forEach((column) => {
      const issueList = column.querySelector(".issue-list");
      while (issueList.firstChild) {
        issueList.removeChild(issueList.firstChild);
      }
    });

    Object.keys(boardState).forEach((columnName) => {
      const column = Array.from(document.querySelectorAll(".column")).find(
        (col) => col.querySelector(".head-name").innerText === columnName,
      );
      if (column) {
        const issueList = column.querySelector(".issue-list");
        boardState[columnName].forEach((cardTitle) => {
          const li = document.createElement("li");
          li.className = "issue-row";

          const div = document.createElement("div");
          div.className = "issue-block";
          div.innerHTML = `<span class="issue-name">${cardTitle}</span>`;

          const deleteButton = document.createElement("button");
          deleteButton.className = "delete-card";
          deleteButton.innerHTML = "&#xE951;";
          deleteButton.addEventListener("click", (e) => {
            e.stopPropagation();

            li.parentElement.removeChild(li);
            saveState();
          });

          div.appendChild(deleteButton);
          li.appendChild(div);
          issueList.appendChild(li);
        });
      }
    });
  }
};

addNewCard.forEach((card) => {
  const newCardWindow = () => {
    const li = document.createElement("li");
    li.className = "issue-row";

    const div = document.createElement("div");
    div.className = "issue-block";

    const divButtons = document.createElement("div");
    divButtons.className = "buttons-block";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter a title for this card...";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-card";
    deleteButton.innerHTML = "&#xE951;";

    const saveButton = document.createElement("button");
    saveButton.className = "add-card";
    saveButton.textContent = "Add Card";

    const saveCard = () => {
      const title = input.value;
      if (title) {
        divButtons.remove();
        div.innerHTML = `<span class="issue-name">${title}</span>`;
        div.appendChild(deleteButton);

        document.querySelectorAll(".issue-row").forEach((row) => {
          row.removeEventListener("mousedown", onMouseDown);
        });
        onMouseClick();
        saveState();
      }
    };

    saveButton.addEventListener("click", saveCard);

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveCard();
      }
    });

    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();

      if (li.parentElement.lastChild.className === divButtons.className) {
        li.parentElement.removeChild(divButtons);
      }
      li.parentElement.removeChild(li);

      saveState();
    });

    div.appendChild(input);
    divButtons.appendChild(saveButton);
    divButtons.appendChild(deleteButton);
    li.appendChild(div);

    const issueList = card.parentElement.querySelector(".issue-list");
    issueList.insertAdjacentElement("beforeend", li);
    issueList.insertAdjacentElement("beforeend", divButtons);
    input.focus();
  };
  card.addEventListener("click", newCardWindow);
});

loadState();

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
    if (targetList) {
      const mouseY = e.clientY;
      const rows = targetList.querySelectorAll(".issue-row");

      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        if (mouseY > rect.top && mouseY < rect.bottom) {
          insertAfter = row;
          insertPlace =
            mouseY < (rect.bottom - rect.top) / 2 + rect.top
              ? "Before"
              : "After";
        }
      });

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

  document.querySelectorAll(".issue-row").forEach((otherRow) => {
    otherRow.style.pointerEvents = "auto";
  });

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
  document.querySelectorAll(".issue-row").forEach((otherRow) => {
    if (otherRow !== actualElement) {
      otherRow.style.pointerEvents = "none";
    }
  });

  const rect = actualElement.getBoundingClientRect();
  actualElement.style.width = `${rect.width}px`;
  actualElement.style.height = `${rect.height}px`;

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

const onMouseClick = () => {
  document.querySelectorAll(".issue-row").forEach((row) => {
    row.addEventListener("mousedown", onMouseDown);
  });
};

onMouseClick();
