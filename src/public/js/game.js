const MAXIMUM_TRIES = 6;

window.addEventListener("load", () => {
  const {word, number} = getWordOfTheDay();
  // while (word.length != 5) word = getWordOfTheDay();
  if (word === '') {
    console.error('The game cannot be loaded, please try again.');
    return;
  }

  console.log(word);

  const gameData = {
    word,
    number,
    entries: [],
    entryDict: [],
    results: [],
    cursor: [0, 0],
    win: false,
    lose: false,
    dictionary: {
      dofus: getDictionary(word.length, 'dofus'),
      french: getDictionary(word.length, 'french')
    }
  };

  createNewEntry(gameData);
  loadGrid(gameData);
  loadEvents(gameData);
});

/**
 * Returns the word of the day
 * @return {string}
 */
function getWordOfTheDay() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/wordoftheday', false);
  xhr.send();
  if (xhr.status === 200) {
    const [number, word] = xhr.responseText.split(' ');
    return { word, number };
  } else {
    console.error('An error has occured while trying to get the word of the day.');
    return '';
  }
}

/**
 * Returns the list of all words in the dictionary in the given length
 * @param {number} length
 * @returns {Array[string]}
 */
function getDictionary(length, dictionary) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `/list?length=${length}&dictionary=${dictionary}`, false);
  xhr.send();
  if (xhr.status === 200) {
    return xhr.responseText;
  } else {
    console.error('An error has occured while trying to get the dictionary.');
    return '';
  }
}

/**
 * Creates an event listener that runs a function depending on which key is pressed.
 * Possible functions are: Add letter, Remove letter, Validate word
 * @param {Data} gameData
 */
function loadEvents(gameData) {
  const keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  gameData.keyboardEvent = document.addEventListener('keydown', (event) => {
    if (gameData.win || gameData.lose) return;

    const key = event.key.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    if (keys.indexOf(key) >= 0) {
      addLetter(gameData, key);
    } else if (key === ' ') {
      addLetter(gameData, '.');
      event.preventDefault();
    } else if (key === 'backspace') {
      removeLetter(gameData);
    } else if (key === 'enter') {
      validateWord(gameData);
    }
    loadGrid(gameData);
  });

  document.getElementById('share').addEventListener('click', (event) => {
    copyResults(gameData);
  });
}

/**
 * Starts a new entry and moves the cursor on this new entry
 * @param {Data} gameData
 */
function createNewEntry(gameData) {
  let entry = Array(gameData.word.length);
  entry[0] = gameData.word[0];
  gameData.entries.push(entry);
  gameData.cursor[0] = gameData.entries.length - 1;
  gameData.cursor[1] = 0;
  gameData.entryDict.push(false);
}

/**
 * Adds a letter in the entry and moves the cursor
 * @param {Data} gameData
 * @param {string} letter
 */
function addLetter(gameData, letter) {
  if (gameData.cursor[1] >= gameData.word.length) return;
  // if (cursor[1] === 0 && letter !== word[0]) cursor[1] = 1;

  gameData.entries[gameData.cursor[0]][gameData.cursor[1]] = letter;
  gameData.cursor[1]++;
}

/**
 * Removes a letter from the entries and moves the cursor
 * @param {Data} gameData
 */
function removeLetter(gameData) {
  if (gameData.cursor[1] <= 0) return;
  gameData.cursor[1]--;

  if (gameData.cursor[1] > 0) {
    gameData.entries[gameData.cursor[0]][gameData.cursor[1]] = '';
  }
}

/**
 * Checks the entered word and makes an action depending on the result
 * @param {Data} gameData
 */
function validateWord(gameData) {
  if (gameData.cursor[1] < gameData.word.length) return;

  const entry = gameData.entries[gameData.cursor[0]].join('');
  const check = checkDictionary(gameData, entry);
  if (!check.exists) return;
  gameData.entryDict[gameData.cursor[0]] = check.dofus;

  gameData.results[gameData.cursor[0]] = checkWord(gameData.word, entry);
  if (gameData.results[gameData.cursor[0]].indexOf(0) === -1 && gameData.results[gameData.cursor[0]].indexOf(1) === -1) {
    gameData.win = true;
  } else if (gameData.cursor[0] + 1 >= MAXIMUM_TRIES) {
    gameData.lose = true;
    console.log('Perdu !');
  } else {
    createNewEntry(gameData);
  }

  const keyColors = {
    correct: [],
    other: [],
    wrong: []
  };
  for (let i = 0; i < gameData.results.length; i++) {
    for (let j = 0; j < gameData.results[i].length; j++) {
      if (gameData.results[i][j] === 1) {
        keyColors.other.push(gameData.entries[i][j].toUpperCase());
      } else if (gameData.results[i][j] === 2) {
        keyColors.correct.push(gameData.entries[i][j].toUpperCase());
      } else {
        keyColors.wrong.push(gameData.entries[i][j].toUpperCase());
      }
    }
  }

  console.log(keyColors);
  loadKeyboard(keyColors.correct, keyColors.other, keyColors.wrong);

  console.log('entered word is', entry);
}

/**
 * Checks if the entry exists in the word database
 * @param {string} entry
 * @returns {Object}
 */
function checkDictionary(gameData, entry) {
  if (gameData.dictionary.dofus.includes(entry)) {
    return {
      exists: true,
      dofus: true
    };
  }

  if (gameData.dictionary.french.includes(entry)) {
    return {
      exists: true,
      dofus: false
    };
  }

  return {
    exists: false,
    dofus: false
  };
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

/**
 * Copy results to clipboard
 * @param {Data} gameData
 */
function copyResults(gameData) {
  const icons = [
    '⬛',
    '🟨',
    '🟩'
  ];
  const dofus = gameData.entryDict.filter(x => x).length;
  
  let str = `SUFOD n°${gameData.number}\nMots Dofus : ${dofus}\n`;

  for (let i = 0; i < gameData.results.length; i++) {
    for (let j = 0; j < gameData.results[i].length; j++) {
      str += icons[gameData.results[i][j]];
    }
    if (gameData.entryDict[i]) {
      str += '⭐';
    }
    str += '\n';
  }

  str += window.location.origin;

  navigator.clipboard.writeText(str);
}

// TODO: iframe integration
