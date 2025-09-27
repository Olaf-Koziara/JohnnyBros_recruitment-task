import initInlineSVG from "./inline-svg.js";
import RankingService from "./ranking-service.js";
import { rankingTableItemTemplate } from "./ranking-table-item.tempalte.js";
import { debounce } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initInlineSVG();
  const app = new PremierLeagueApp(".ranking-table");
});

class PremierLeagueApp {
  #isLoading = false;
  #container = null;
  #rankingTableList = null;
  #searchInput = null;
  #form = null;
  #teams = [];
  #filteredTeams = [];
  #rankingService = null;

  constructor(containerSelector) {
    this.#container = document.querySelector(containerSelector);
    if (!this.#container) throw new Error("Container element not found");
    const { form, searchInput, rankingTableList, } = this.#setupDOM();
    this.#form = form;
    this.#searchInput = searchInput;
    this.#rankingTableList = rankingTableList;
    this.#rankingService = new RankingService();
    this.#init();
  }

  #init() {
    this.#handleFormReset();
    this.#handleSearchInput();
    this.#renderSkeleton(5).then(() => {
      const needsScroll = window.innerHeight < document.body.scrollHeight;
      if (needsScroll) {
        this.#initializeFetchOnScroll();
        return;
      }
      this.#fetchData();
    });
  }

  #setupDOM() {
    const form = this.#container.querySelector(".ranking-table__search");
    const searchInput = form?.querySelector(".ranking-table__search-input");

    if (!form || !searchInput) {
      throw new Error("Form or input elements not found");
    }
    const rankingTableList = this.#container.querySelector(
      ".ranking-table__list"
    );
    return { form, searchInput, rankingTableList };
  }

  #handleFormReset() {
    this.#form.addEventListener("reset", (e) => {
      e.preventDefault();
      this.#searchInput.value = "";
      this.#filteredTeams = this.#teams;
    });
  }

  async #handleSearchInput() {
    const debouncedSearch = debounce(async (searchTerm) => {
      this.#setIsLoading(true);
      this.#filteredTeams = await this.#rankingService.search(searchTerm);
      this.#setIsLoading(false);
      this.#render();

    }, 300);
    this.#searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      debouncedSearch(searchTerm);
      this.#form.classList.toggle("ranking-table__search--active", !!searchTerm);
    });
  }

  async #fetchData() {
    const data = await this.#rankingService.getAll();
    if (data) {
      this.#teams = data;
    }
    this.#filteredTeams = data;
    this.#render();
  }

  #createTableItem(team, additionalClasses = "") {
    const listItem = document.createElement("li");
    const classNames = `ranking-table__item ${team ? "" : "ranking-table__item--skeleton"} ${additionalClasses}`.split(" ").filter(Boolean);

    listItem.classList.add(...classNames);
    listItem.innerHTML = rankingTableItemTemplate(team);
    return listItem;
  }

  #renderSkeleton(count, options = {}) {
    return new Promise((resolve) => {
      this.#rankingTableList.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const skeletonItem = this.#createTableItem(null);
        this.#rankingTableList.appendChild(skeletonItem, options?.animation ? "animation" : undefined);
      }
      resolve();
    });
  }

  #render() {
    this.#rankingTableList.innerHTML = "";
    this.#filteredTeams.forEach((team) => {
      const tableItem = this.#createTableItem(team);
      this.#rankingTableList.appendChild(tableItem);
    });
  }

  #initializeFetchOnScroll() {
    window.addEventListener(
      "scroll",
      () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 0) {
          this.#fetchData();
        }
      },
      { once: true }
    );
  }
  #setIsLoading(value) {
    this.#isLoading = value;
    if (value) {
      this.#renderSkeleton(5, { animation: true });
    }
  }
}
