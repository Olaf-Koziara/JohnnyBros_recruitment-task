import initInlineSVG from "./inline-svg.js";
import RankingService from "./services/ranking-service.js";
import { rankingTableItem } from "./components/ranking-table-item.component.js";
import { rankingTableMessage } from "./components/ranking-table-message.component.js";
import { debounce } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initInlineSVG();
  const app = new PremierLeagueRankingApp(".ranking-table");
});

class PremierLeagueRankingApp {
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
    this.#rankingService = new RankingService('https://www.thesportsdb.com/api/v1/json/123/lookuptable.php?l=4328&s=2024-2025');
    this.#init();
  }

  #init() {
    this.#handleFormReset();
    this.#handleSearchInput();
    this.#renderSkeleton(5).then(() => {
      const scrollPossible = window.innerHeight < document.body.scrollHeight;
      if (scrollPossible) {
        this.#initializeFetchOnScroll();
        return;
      }
      this.#initializeFetchOnWheel();
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
      this.#render();
      this.#form.classList.remove("ranking-table__search--active");
    });
  }

  async #handleSearchInput() {
    const debouncedSearch = debounce(async (searchTerm) => {
      if (this.#teams.length === 0) await this.#fetchData();
      if (this.#teams.length === 0) return; 
      this.#setIsLoading(true);
      this.#filteredTeams = await this.#rankingService.search(searchTerm);
      this.#setIsLoading(false);
      if (this.#filteredTeams.length === 0) {
        this.#renderNoResults();
        return;
      }
      this.#render();

    }, 300);
    this.#searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      debouncedSearch(searchTerm);
      this.#form.classList.toggle("ranking-table__search--active", !!searchTerm);
    });
  }

  async #fetchData() {
    try {
    const data = await this.#rankingService.getAll();
    if (data) {
      this.#teams = data;
    }
    this.#filteredTeams = data;
    this.#render();
    } catch (error) {
      this.#renderError(error.message);
      return;
    }
  
  }

  #renderSkeleton(count, options = {}) {
    return new Promise((resolve) => {
      this.#rankingTableList.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const skeletonItem = rankingTableItem(null, options?.animation ? "animation" : undefined);
        this.#rankingTableList.appendChild(skeletonItem);
      }
      resolve();
    });
  }
#renderError() {
    this.#rankingTableList.innerHTML = "";
  this.#rankingTableList.appendChild(rankingTableMessage('There was a problem. Please try again later.'));
}
  #render() {
    this.#rankingTableList.innerHTML = "";
    this.#filteredTeams.forEach((team) => {
      const tableItem = rankingTableItem(team);
      this.#rankingTableList.appendChild(tableItem);
    });
  }
  #renderNoResults() {
    this.#rankingTableList.innerHTML = "";
    this.#rankingTableList.appendChild(rankingTableMessage(`No teams found matching "${this.#searchInput.value}"`, ["ranking-table__message--not-found"]));
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
  #initializeFetchOnWheel() {
    window.addEventListener(
      "wheel",
      (e) => {
        if (e.deltaY > 0) {
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
