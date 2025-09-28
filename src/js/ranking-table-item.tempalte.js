export const rankingTableItemTemplate = (team) => {
  const statsSum =
    Number(team?.intWin ?? 0) +
    Number(team?.intDraw ?? 0) +
    Number(team?.intLoss ?? 0);
  const countStatRatio = (stat) => {
    if (statsSum === 0) return 0;
    return ((Number(stat) / statsSum) * 100).toFixed(1);
  };
  const formResultClasses = {
    W: "ranking-table__item-form-result--win",
    D: "ranking-table__item-form-result--draw",
    L: "ranking-table__item-form-result--loss"
  };
  const teamInfo = () => `
              <div class="ranking-table__item-team-info">
                <div class="ranking-table__item-badge-wrapper">
                  <img src=${team?.strBadge ?? ""} alt="${team?.strTeam ?? ""} logo" class="ranking-table__item-badge"/>
                </div>
                <div class="ranking-table__item-name">${team?.strTeam ?? ""}</div>
              </div>`
  const statisticsBarHTML = () => `              
              <div class="ranking-table__item-statistics-bar">
                <div class="ranking-table__item-statistics-bar-fill ranking-table__item-statistics-bar-fill--win" style="width: ${countStatRatio(team?.intWin ?? 0)}%"></div>
                <div class="ranking-table__item-statistics-bar-fill ranking-table__item-statistics-bar-fill--draw" style="width: ${countStatRatio(team?.intDraw ?? 0)}%"></div>
                <div class="ranking-table__item-statistics-bar-fill ranking-table__item-statistics-bar-fill--loss" style="width: ${countStatRatio(team?.intLoss ?? 0)}%"></div>
              </div>`
  const statisticsNumbersHTML = () => `        
              <div class="ranking-table__item-statistics-numbers">
                <span class="ranking-table__item-stat">W: ${team?.intWin ?? ""}</span>
                <span class="ranking-table__item-stat">D: ${team?.intDraw ?? ""}</span>
                <span class="ranking-table__item-stat">L: ${team?.intLoss ?? ""}</span>
              </div>`
  const formHTML = () => `
              <div class="ranking-table__item-form-wrapper">
              Form:
              <div class="ranking-table__item-form">
              ${team?.strForm?.split("").map((result) =>
    `<span class="ranking-table__item-form-result ${formResultClasses[result]}">${result}</span>`).join('')}
              </div>
              </div>`
  const goalsHTML = () => `<div class="ranking-table__item-goals">
                            Goals for:
                            <div class="ranking-table__item-goals-value">${team?.intGoalsFor ?? ""}</div>
                          </div>
                          <div class="ranking-table__item-goals">
                            Goals against:
                            <div class="ranking-table__item-goals-value">${team?.intGoalsAgainst ?? ""}</div>
                          </div>
                          <div class="ranking-table__item-goals">
                            Goals difference:
                            <div class="ranking-table__item-goals-value">${team?.intGoalDifference ?? ""}</div>
                          </div>`
  return `
    
        <div class="ranking-table__item-header">
            <div class="ranking-table__item-ranking">${team?.intRank ?? ""}</div>
            <div class="ranking-table__item-team">
              ${teamInfo()}
              <div class="ranking-table__item-statistics">
              ${statisticsBarHTML()}
              ${statisticsNumbersHTML()}
              </div>
            </div>
          </div>
          <div class="ranking-table__item-points">${team?.intPoints ?? ""} PTS</div>
          <div class="ranking-table__item-footer">
          ${formHTML()}
          ${goalsHTML()}
        </div>
      
   
    `;
};
