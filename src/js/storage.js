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

export const initializeBoardState = () => {
  if (!localStorage.getItem("boardState")) {
    localStorage.setItem("boardState", JSON.stringify(previewBoardState));
  }
};

export const saveState = () => {
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

export const loadState = () => {
  return JSON.parse(localStorage.getItem("boardState"));
};
