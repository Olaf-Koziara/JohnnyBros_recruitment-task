class RankingService {
  #data = [];
  #apiEndpoint = '';
  constructor(endpoint) {
    this.#apiEndpoint = endpoint;
  }
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
      throw new Error("Failed to fetch ranking data: " + error.message);
    }
  }

  async search(term) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.#performSearch(term));
      }, 350);  // Simulate network delay
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
