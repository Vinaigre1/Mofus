const MAXIMUM_TRIES = 6;

window.onload = () => {
  const word = 'magouille';
  let entries = [];
  let cursor = [0, 0];
  createNewEntry(word, entries, cursor);
  loadGrid(word, entries, cursor);
  loadKeyboard(word, entries, cursor);
};

function loadGrid(word, entries, cursor) {
  const gridEl = document.getElementById('grid');
  const tableEl = document.createElement('table');
  for (let i = 0; i < MAXIMUM_TRIES; i++) {
    const trEl = document.createElement('tr');
    for (let j = 0; j < word.length; j++) {
      const tdEl = document.createElement('td');
      tdEl.textContent = entries[i] && entries[i][j] || (i == cursor[0] ? '.' : '');
      trEl.appendChild(tdEl);
    }
    tableEl.appendChild(trEl);
  }
  gridEl.innerHTML = '';
  gridEl.appendChild(tableEl);
}

function loadKeyboard(word, entries, cursor) {
  const keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    if (keys.indexOf(key) >= 0) {
      addLetter(word, entries, cursor, key);
    } else if (key === 'backspace') {
      removeLetter(word, entries, cursor);
    } else if (key === 'enter') {
      validateWord(word, entries, cursor);
    }
  });
}

function createNewEntry(word, entries, cursor) {
  let entry = Array(word.length);
  entry[0] = word[0];
  entries.push(entry);
  cursor[0] = entries.length - 1;
  cursor[1] = 0;
}

function addLetter(word, entries, cursor, letter) {
  if (cursor[1] >= word.length) return;
  if (cursor[1] === 0 && letter !== word[0]) cursor[1] = 1;

  entries[cursor[0]][cursor[1]] = letter;
  loadGrid(word, entries, cursor);
  cursor[1]++;
}

function removeLetter(word, entries, cursor) {
  if (cursor[1] <= 0) return;
  cursor[1]--;

  if (cursor[1] > 0) {
    entries[cursor[0]][cursor[1]] = '';
    loadGrid(word, entries, cursor);
  }
}

function validateWord(word, entries, cursor) {
  if (cursor[1] < word.length) return;

  const entry = entries[cursor[0]].join('');
  if (!wordExists(entry)) return;

  if (checkWord(word, entry)) {
    console.log('Gagné !');
  } else if (cursor[0] + 1 >= MAXIMUM_TRIES) {
    console.log('Perdu !');
  } else {
    createNewEntry(word, entries, cursor);
    loadGrid(word, entries, cursor);
  }

  console.log('entered word is', entry);
}

function wordExists(entry) {
  // TODO
  return true;
}

function checkWord(word, entry) {
  // TODO
  return false;
}
