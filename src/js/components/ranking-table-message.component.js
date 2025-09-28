export const rankingTableMessage = (message, classNames = []) => {
  const listItem = document.createElement("li");
  listItem.classList.add("ranking-table__message");
  classNames.forEach(cls => listItem.classList.add(cls));
  listItem.textContent = message;
  return listItem;
};