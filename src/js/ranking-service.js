const rankingService = () => {
  const API_URL =
    "https://www.thesportsdb.com/api/v1/json/123/lookuptable.php?l=4328&s=2024-2025";

  const fetchRankingData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching ranking data:", error);
      return null;
    }
  };

  return {
    fetchRankingData,
  };
};
export default rankingService;
