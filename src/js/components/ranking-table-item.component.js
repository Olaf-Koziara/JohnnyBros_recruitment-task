export const rankingTableItem = (team = null, additionalClasses = '') => {
  const statsSum =
    Number(team?.intWin ?? 0) +
    Number(team?.intDraw ?? 0) +
    Number(team?.intLoss ?? 0);

  const countStatRatio = (stat) => {
    if (statsSum === 0) return 0;
    return ((Number(stat) / statsSum) * 100).toFixed(1);
  };

  const handleImageError = (img) => {
    img.onerror = null;
    img.src = '/assets/icons/ball.svg';
  };

  const formResultClasses = {
    W: "ranking-table__item-form-result--win",
    D: "ranking-table__item-form-result--draw",
    L: "ranking-table__item-form-result--loss"
  };

  const teamInfoTemplate = `
    <div class="ranking-table__item-team-info">
      <div class="ranking-table__item-badge-wrapper">
        <img src="${team?.strBadge ?? "/assets/icons/ball.svg"}" 
             alt="${team?.strTeam ?? ""} logo" 
             class="ranking-table__item-badge"/>
      </div>
      <div class="ranking-table__item-name">${team?.strTeam ?? ""}</div>
    </div>`;

  const statisticsBarTemplate = `              
    <div class="ranking-table__item-statistics-bar">
      <div class="ranking-table__item-statistics-bar-fill ranking-table__item-statistics-bar-fill--win" style="width: ${countStatRatio(team?.intWin ?? 0)}%"></div>
      <div class="ranking-table__item-statistics-bar-fill ranking-table__item-statistics-bar-fill--draw" style="width: ${countStatRatio(team?.intDraw ?? 0)}%"></div>
      <div class="ranking-table__item-statistics-bar-fill ranking-table__item-statistics-bar-fill--loss" style="width: ${countStatRatio(team?.intLoss ?? 0)}%"></div>
    </div>`;

  const statisticsNumbersTemplate = `        
    <div class="ranking-table__item-statistics-numbers">
      <span class="ranking-table__item-stat">W: ${team?.intWin ?? ""}</span>
      <span class="ranking-table__item-stat">D: ${team?.intDraw ?? ""}</span>
      <span class="ranking-table__item-stat">L: ${team?.intLoss ?? ""}</span>
    </div>`;

  const formTemplate = `
    <div class="ranking-table__item-form-wrapper">
      Form:
      <div class="ranking-table__item-form">
        ${team?.strForm?.split("").reverse().map((result) =>
    `<span class="ranking-table__item-form-result ${formResultClasses[result]}">${result}</span>`
  ).join('')}
      </div>
    </div>`;

  const goalsTemplate = `
    <div class="ranking-table__item-goals">
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
    </div>`;

  const template = `
    <div class="ranking-table__item-header">
      <div class="ranking-table__item-ranking">${team?.intRank ?? ""}</div>
      <div class="ranking-table__item-team">
        ${teamInfoTemplate}
        <div class="ranking-table__item-statistics">
          ${statisticsBarTemplate}
          ${statisticsNumbersTemplate}
        </div>
      </div>
    </div>
    <div class="ranking-table__item-points">${team?.intPoints ?? ""} PTS</div>
    <div class="ranking-table__item-footer">
      ${formTemplate}
      ${goalsTemplate}
    </div>`;

  const listItem = document.createElement("li");
  const classNames = `ranking-table__item ${team ? "" : "ranking-table__item--skeleton"} ${additionalClasses}`.split(" ").filter(Boolean);
  listItem.classList.add(...classNames);
  listItem.innerHTML = DOMPurify.sanitize(template);
  listItem.querySelector('.ranking-table__item-badge').onerror = (e) => handleImageError(e.target);
  return listItem;
};
