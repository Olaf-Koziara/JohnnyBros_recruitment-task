class RankingService {
  #apiEndpoint =
    "https://www.thesportsdb.com/api/v1/json/123/lookuptable.php?l=4328&s=2024-2025";
  #data = [];

  async getAll() {
    try {
      const response = await fetch(this.#apiEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.#data = data.table;
      return data.table;
    } catch (error) {
      console.error("Error fetching ranking data:", error);
      return [];
    }
  }

  search(term) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.#performSearch(term));
      }, 700);
    });
  }

  #performSearch(term) {
    if (!term) return this.#data;
    return this.#data.filter((item) =>
      item.strTeam?.toLowerCase().includes(term.toLowerCase())
    );
  }
}
export default RankingService;
