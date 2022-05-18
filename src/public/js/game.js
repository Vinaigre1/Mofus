const MAXIMUM_TRIES = 6;

window.addEventListener("load", () => {
  const word = 'magouille';
  let entries = [];
  let results = [];
  let cursor = [0, 0];
  createNewEntry(word, entries, cursor);
  loadGrid(word, entries, cursor, results);
  loadEvents(word, entries, cursor, results);
});

/**
 * Loads the grid with every entry and results
 * @param {string} word
 * @param {Array} entries
 * @param {Array} cursor
 * @param {Array} results
 */
function loadGrid(word, entries, cursor, results) {
  const gridEl = document.getElementById('grid');
  const tableEl = document.createElement('table');
  const resultClasses = ['none', 'other', 'right'];

  const prefill = Array(word.length);
  prefill.fill('.');
  prefill[0] = word[0];
  for (let i = 0; i < results.length; i++) {
    for (let j = 0; j < results[i].length; j++) {
      if (prefill[j] === '.' && results[i][j] === 2) {
        prefill[j] = entries[i][j];
      }
    }
  }

  for (let i = 0; i < MAXIMUM_TRIES; i++) {
    const trEl = document.createElement('tr');
    let line = entries[i];
    if (i === cursor[0] && cursor[1] === 0) {
      line = prefill;
    }
    for (let j = 0; j < word.length; j++) {
      const tdEl = document.createElement('td');
      tdEl.textContent = line && line[j] || (i == cursor[0] ? '.' : '');
      tdEl.classList.add(resultClasses[results[i] && results[i][j] || 0]);
      trEl.appendChild(tdEl);
    }
    tableEl.appendChild(trEl);
  }
  gridEl.innerHTML = tableEl.outerHTML;
}

/**
 * Creates an event listener that runs a function depending on which key is pressed.
 * Possible functions are: Add letter, Remove letter, Validate word
 * @param {string} word
 * @param {Array} entries
 * @param {Array} cursor
 * @param {Array} results
 */
function loadEvents(word, entries, cursor, results) {
  const keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    if (keys.indexOf(key) >= 0) {
      addLetter(word, entries, cursor, key);
    } else if (key === 'backspace') {
      removeLetter(word, entries, cursor);
    } else if (key === 'enter') {
      validateWord(word, entries, cursor, results);
    }
    loadGrid(word, entries, cursor, results);
  });
}

/**
 * Starts a new entry and moves the cursor on this new entry
 * @param {string} word
 * @param {Array} entries
 * @param {Array} cursor
 */
function createNewEntry(word, entries, cursor) {
  let entry = Array(word.length);
  entry[0] = word[0];
  entries.push(entry);
  cursor[0] = entries.length - 1;
  cursor[1] = 0;
}

/**
 * Adds a letter in the entry and moves the cursor
 * @param {string} word
 * @param {Array} entries
 * @param {Array} cursor
 * @param {string} letter
 */
function addLetter(word, entries, cursor, letter) {
  if (cursor[1] >= word.length) return;
  if (cursor[1] === 0 && letter !== word[0]) cursor[1] = 1;

  entries[cursor[0]][cursor[1]] = letter;
  cursor[1]++;
}

/**
 * Removes a letter from the entries and moves the cursor
 * @param {string} word
 * @param {Array} entries
 * @param {Array} cursor
 * @returns 
 */
function removeLetter(word, entries, cursor) {
  if (cursor[1] <= 0) return;
  cursor[1]--;

  if (cursor[1] > 0) {
    entries[cursor[0]][cursor[1]] = '';
  }
}

/**
 * Checks the entered word and makes an action depending on the result
 * @param {string} word
 * @param {Array} entries
 * @param {Array} cursor
 * @param {Array} results
 */
function validateWord(word, entries, cursor, results) {
  if (cursor[1] < word.length) return;

  const entry = entries[cursor[0]].join('');
  if (!wordExists(entry)) return;

  results[cursor[0]] = checkWord(word, entry);
  if (results[cursor[0]].indexOf(0) === -1 && results[cursor[0]].indexOf(1) === -1) {
    console.log('Gagné !');
  } else if (cursor[0] + 1 >= MAXIMUM_TRIES) {
    console.log('Perdu !');
  } else {
    createNewEntry(word, entries, cursor);
  }

  const keyColors = {
    correct: [],
    other: []
  };
  for (let i = 0; i < results.length; i++) {
    for (let j = 0; j < results[i].length; j++) {
      if (results[i][j] === 1) {
        keyColors.other.push(entries[i][j].toUpperCase());
      } else if (results[i][j] === 2) {
        keyColors.correct.push(entries[i][j].toUpperCase());
      }
    }
  }

  console.log(keyColors);
  loadKeyboard(keyColors.correct, keyColors.other);

  console.log('entered word is', entry);
}

/**
 * Checks if the entry exists in the word database
 * @param {string} entry
 * @returns {boolean}
 */
function wordExists(entry) {
  // TODO
  entry;
  return true;
}

/**
 * Compares _word and entry and return an array of numbers that represents the result.
 * @param {string} _word 
 * @param {string} entry 
 * @returns {Array[number]} Array of 0s (letter not present), 1s (letter in different position) and 2s (letter in correct position)
 */
function checkWord(_word, entry) {
  const word = _word.split('');
  const result = Array(word.length);
  for (let i = 0; i < entry.length; i++) {
    if (entry[i] === word[i]) {
      result[i] = 2;
      word[i] = '';
    }
  }

  for (let i = 0; i < entry.length; i++) {
    if (result[i]) continue;
    for (let j = 0; j < word.length; j++) {
      if (entry[i] === word[j]) {
        result[i] = 1;
        word[j] = '';
        break;
      }
    }
    if (!result[i]) {
      result[i] = 0;
    }
  }
  return result;
}

// TODO: iframe integration
