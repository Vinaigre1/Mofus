/**
 * Loads the grid with every entry and results
 * @param {Data} gameData
 */
 function loadGrid(gameData) {
  const gridEl = document.getElementById('grid');
  const tableEl = document.createElement('table');
  const resultClasses = ['none', 'other', 'right'];

  const prefill = Array(gameData.word.length);
  prefill.fill('.');
  prefill[0] = gameData.word[0];
  for (let i = 0; i < gameData.results.length; i++) {
    for (let j = 0; j < gameData.results[i].length; j++) {
      if (prefill[j] === '.' && gameData.results[i][j] === 2) {
        prefill[j] = gameData.entries[i][j];
      }
    }
  }

  for (let i = 0; i < MAXIMUM_TRIES; i++) {
    const trEl = document.createElement('tr');
    const leftTdEl = document.createElement('td');
    const rightTdEl = document.createElement('td');

    leftTdEl.classList.add('padding');
    trEl.appendChild(leftTdEl);

    let line = gameData.entries[i];
    let prefilled = false;
    if (i === gameData.cursor[0] && gameData.cursor[1] === 0) {
      line = prefill;
      prefilled = true;
    }
    for (let j = 0; j < gameData.word.length; j++) {
      const tdEl = document.createElement('td');
      tdEl.textContent = line && line[j] || (i == gameData.cursor[0] ? '.' : '');
      tdEl.classList.add(resultClasses[gameData.results[i] && gameData.results[i][j] || 0]);
      if (i === gameData.cursor[0] && j === gameData.cursor[1]) {
        tdEl.classList.add('cursor');
      }
      if (prefilled) {
        tdEl.classList.add('placeholder');
      }
      trEl.appendChild(tdEl);
    }
    if (gameData.entryDict[i]) {
      rightTdEl.classList.add('dofus');
    } else {
      rightTdEl.classList.add('padding');
    }
    trEl.appendChild(rightTdEl);
    tableEl.appendChild(trEl);
  }
  gridEl.innerHTML = tableEl.outerHTML;
}