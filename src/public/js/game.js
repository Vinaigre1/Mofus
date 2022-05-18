const MAXIMUM_TRIES = 6;

window.addEventListener('load', () => {
  const {word, number} = getWordOfTheDay();
  // while (word.length < 3 || word.length > 9) word = getWordOfTheDay();
  if (word === '') {
    console.error('The game cannot be loaded, please try again.');
    return;
  }

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
  loadKeyboard(gameData);
  loadGame(gameData);
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
 * Creates an event listener on the keyboard.
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
      event.preventDefault(); // Avoids scrolling down the page with space
    } else if (key === 'backspace') {
      removeLetter(gameData);
    } else if (key === 'enter') {
      validateWord(gameData);
    }
    loadGrid(gameData);
    updateGame(gameData);
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
  letter = letter.toUpperCase();
  if (gameData.cursor[1] >= gameData.word.length) return;

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

  const entry = gameData.entries[gameData.cursor[0]].join('').toLowerCase();
  const check = checkDictionary(gameData, entry);
  if (!check.exists) return;
  gameData.entryDict[gameData.cursor[0]] = check.dofus;

  gameData.results[gameData.cursor[0]] = checkWord(gameData.word, entry);
  if (gameData.results[gameData.cursor[0]].indexOf(0) === -1 && gameData.results[gameData.cursor[0]].indexOf(1) === -1) {
    gameData.win = true;
    loadWinPanel(gameData);
    updateStats(gameData);
  } else if (gameData.cursor[0] + 1 >= MAXIMUM_TRIES) {
    gameData.lose = true;
    loadLosePanel(gameData);
    updateStats(gameData);
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

  loadKeyboard(gameData, keyColors.correct, keyColors.other, keyColors.wrong);
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
  const icons = [ '⬛', '🟨', '🟩' ];
  const dofus = gameData.entryDict.filter(x => x).length;
  const length = gameData.win ? gameData.cursor[0] : '-';

  let str = `SUFOD n°${gameData.number} : ${length}/6\nMots Dofus : ${dofus}\n\n`;
  for (let i = 0; i < gameData.results.length; i++) {
    for (let j = 0; j < gameData.results[i].length; j++) {
      str += icons[gameData.results[i][j]];
    }
    if (gameData.entryDict[i]) {
      str += '⭐';
    }
    str += '\n';
  }
  str += '\n';
  str += window.location.origin;

  navigator.clipboard.writeText(str);
  const messageNode = document.querySelector('.share-message');
  messageNode.style.opacity = 1;
  setTimeout(() => {
    messageNode.style.opacity = 0;
  }, 2000);
}

/**
 * Update the game in local storage
 * @param {Data} gameData
 */
function updateGame(gameData) {
  const game = JSON.parse(localStorage.getItem('game')) || {
    'date': new Date().getTime(),
    'words': [],
    'state': 'in_progress'
  };

  if (game.state !== 'in_progress') return;

  game.words = [];

  for (let i = 0; i < gameData.entries.length; i++) {
    if (i < gameData.cursor[0]) {
      game.words.push(gameData.entries[i].join(''));
    }
  }
  localStorage.setItem('game', JSON.stringify(game));
}

/**
 * Update the stats in local storage
 * @param {number} numberOfTries
 */
function updateStats(gameData) {
  const stats = JSON.parse(localStorage.getItem('stats')) || {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '-': 0,
    'streak': 0,
    'maxStreak': 0
  };
  const game = JSON.parse(localStorage.getItem('game')) || {
    'date': new Date().getTime(),
    'words': [],
    'state': 'in_progress'
  };
  const numberOfTries = gameData.cursor[0] + 1;

  if (game.state !== 'in_progress') return;

  if (numberOfTries >= 1 && numberOfTries <= 6) {
    stats[numberOfTries]++;
    stats.streak++;
    game.state = 'win';
  } else {
    stats['-']++;
    stats.streak = 0;
    game.state = 'lose';
  }
  stats.maxStreak = Math.max(stats.maxStreak, stats.streak);

  game.words.push(gameData.entries[gameData.cursor[0]].join(''));

  localStorage.setItem('stats', JSON.stringify(stats));
  localStorage.setItem('game', JSON.stringify(game));
}

/**
 * Load the game from local storage
 * @param {Data} gameData 
 */
function loadGame(gameData) {
  const game = JSON.parse(localStorage.getItem('game'));
  if (!game) return;

  const start = new Date();
  start.setHours(0,0,0,0);

  if (game.date < start.getTime()) {
    localStorage.setItem('game', JSON.stringify(
      {
        'date': new Date().getTime(),
        'words': [],
        'state': 'in_progress'
      }
    ));
  } else {
    for (let i = 0; i < game.words.length; i++) {
      for (let j = 0; j < game.words[i].length; j++) {
        addLetter(gameData, game.words[i][j]);
      }
      validateWord(gameData);
    }
  }
  loadGrid(gameData);
}

// TODO: iframe integration
