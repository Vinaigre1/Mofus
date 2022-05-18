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

/**
 * Load the Game Over panel
 * @param {Data} gameData
 */
function loadPanel(gameData) {
  const panel = document.getElementById('panel');
  const template = document.getElementById('panel-template');
  const contentCopy = template.cloneNode(true);

  contentCopy.id = '';
  contentCopy.classList.remove('invisible');

  const panelTitle = contentCopy.querySelector('h2');
  panelTitle.innerHTML = 'Gagné !';

  const headerContent = contentCopy.querySelector('.panel-header');
  headerContent.innerHTML = `<p>Vous avez trouvé le mot : <span id="word">${gameData.word}</span></p>`;

  const resultsHeaderContent = contentCopy.querySelector('.panel-results-header');
  resultsHeaderContent.innerHTML = `<p>SUFOD ${gameData.number} ${gameData.cursor.length}/6</p><p>Mots Dofus : <span id="dofus-words">${gameData.entryDict.filter(x => x).length}</span></p>`;

  const resultsTable = contentCopy.querySelector('.panel-results-table');
  const icons = ['icon-black', 'icon-yellow', 'icon-green'];
  let html = '';
  for (let i = 0; i < gameData.results.length; i++) {
    html += '<tr>';
    for (let j = 0; j < gameData.results[i].length; j++) {
      html += `<td class="${icons[gameData.results[i][j]]}"></td>`;
    }
    html += `<td class="${gameData.entryDict[i] ? 'icon-star' : ''}"></td>`;
    html += '</tr>';
  }
  resultsTable.innerHTML = html;

  contentCopy.querySelector('#share').addEventListener('click', () => {
    copyResults(gameData);
  });

  contentCopy.querySelector('.panel-cross').addEventListener('click', () => {
    contentCopy.remove();
    panel.classList.add('invisible');
  });

  panel.classList.remove('invisible');
  panel.innerHTML = '';
  panel.appendChild(contentCopy);
}
