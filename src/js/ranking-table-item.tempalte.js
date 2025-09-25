export const rankingTableItemTemplate = (team) =>
  `
      <div class="ranking-table__item-rank">${team?.intRank ?? ""}</div>
      <div>
        <div class="ranking-table__item-header">
          <div class="ranking-table__item-name">${team?.strTeam ?? ""}</div>
          <div class="ranking-table__item-stats">${team?.intWin ?? ""}W ${
    team?.intDraw ?? ""
  }D ${team?.intLoss ?? ""}L</div>
          <div class="ranking-table__item-points">${team?.intPoints ?? ""}</div>
        </div>
        <div class="ranking-table__item-footer">
      
          <div class="ranking-table__item-goals">${team?.intGoalsFor ?? ""}:${
    team?.intGoalsAgainst ?? ""
  }</div>
        </div>
      </div>
    `;
