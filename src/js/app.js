import initInlineSVG from "./inline-svg.js";
import rankingService from "./ranking-service.js";
document.addEventListener("DOMContentLoaded", () => {
  initInlineSVG();
});
class PremierLeagueApp {
  #isLoading = false;
  #container = null;
  #rankingTableList = null;
  #searchInput = null;
  #form = null;
  #teams = [];
  #filteredTeams = [];

  constructor(containerSelector) {
    this.#container = document.querySelector(containerSelector);
    this.#form = this.#container.querySelector(".ranking-table__search");
    this.#searchInput = this.#form.querySelector(
      ".ranking-table__search-input"
    );
    this.#rankingTableList = this.#container.querySelector(
      ".ranking-table__list"
    );
    this.init();
  }
  init() {
    this.#form.addEventListener("reset", (e) => {
      e.preventDefault();
      this.#searchInput.value = "";
      this.#filteredTeams = this.#teams;
      this.renderSkeleton(5);
    });
  }
  fetchData() {
    this.#isLoading = true;
    rankingService
      .fetchRankingData()
      .then((data) => {
        this.#teams = data;
        this.#filteredTeams = data;
        this.render();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        this.#isLoading = false;
      });
  }
  createTableItem(team) {
    const listItem = document.createElement("li");
    const className = team
      ? "ranking-table__item"
      : "ranking-table__item--skeleton";
    listItem.classList.add(className);
  }
  renderSkeleton(count) {
    this.#rankingTableList.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const skeletonItem = this.createTableItem(null);
      this.#rankingTableList.appendChild(skeletonItem);
    }
  }
  render() {
    this.#rankingTableList.innerHTML = "";
    this.#filteredTeams.forEach((team) => {
      const tableItem = this.createTableItem(team);
      this.#rankingTableList.appendChild(tableItem);
    });
  }
}
