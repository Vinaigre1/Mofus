const MAXIMUM_TRIES = 6;

window.addEventListener('load', () => {
  const {word, number} = getWordOfTheDay();
  // while (word.length < 3 || word.length > 9) word = getWordOfTheDay();
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
  loadKeyboard(gameData);
  loadGame(gameData);
});

/**
 * Returns the word of the day
 * @return {string}
 */
function getWordOfTheDay() {
  function treatAsUTC(date) {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }
  
  function daysBetween(startDate, endDate) {
    return (treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime()) / (24 * 60 * 60 * 1000);
  }

  const startDate = new Date(2022, 5);
  const num = Math.floor(daysBetween(startDate, new Date()));
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const words = {
    1: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '31' },
    2: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '', 31: '' },
    3: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '31' },
    4: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '' },
    5: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: 'ankama', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '31' },
    6: { 1: 'biblop', 2: 'harpille', 3: 'meno', 4: 'douzdoa', 5: 'tetanie', 6: 'blop', 7: 'dague', 8: 'assaut', 9: 'goulafre', 10: 'vetauran', 11: 'buveur', 12: 'atonie', 13: 'meulou', 14: 'vindicte', 15: 'yechti', 16: 'ginga', 17: 'envol', 18: 'orichor', 19: 'tourelle', 20: 'furia', 21: 'cuirasse', 22: 'vertu', 23: 'butor', 24: 'vulkania', 25: 'frigost', 26: 'wobot', 27: 'horize', 28: 'soryo', 29: 'nagate', 30: 'prytek', 31: '' },
    7: { 1: 'creation', 2: 'akwadala', 3: 'bombance', 4: 'compas', 5: 'imorok', 6: 'ouilleur', 7: 'grisou', 8: 'kawaii', 9: 'rappel', 10: 'gourlo', 11: 'peur', 12: 'prygen', 13: 'olgoth', 14: 'ocre', 15: 'arcanin', 16: 'dragon', 17: 'ethylo', 18: 'menace', 19: 'kwoan', 20: 'bouflouth', 21: 'gloot', 22: 'meupette', 23: 'maree', 24: 'trithon', 25: 'krokille', 26: 'choudini', 27: 'tison', 28: 'vetauran', 29: 'derobade', 30: 'erudit', 31: 'karne' },
    8: { 1: 'noctulule', 2: 'septange', 3: 'malterego', 4: 'grasmera', 5: 'pelage', 6: 'lifo', 7: 'nomekop', 8: 'espingole', 9: 'bouclier', 10: 'raillerie', 11: 'kanniboul', 12: 'nelween', 13: 'paradoxe', 14: 'feu', 15: 'synchro', 16: 'stimulant', 17: 'blerice', 18: 'robuste', 19: 'hardi', 20: 'mystique', 21: 'warko', 22: 'douzdoa', 23: 'eliotrope', 24: 'crapaud', 25: 'momistik', 26: 'milirat', 27: 'kaniglou', 28: 'arc', 29: 'cactana', 30: 'pandanlku', 31: 'hakam' },
    9: { 1: 'dofus', 2: 'tiwabbit', 3: 'pikbul', 4: 'silf', 5: 'gambaf', 6: 'yomi', 7: 'versatile', 8: 'misere', 9: 'armutin', 10: 'vertige', 11: 'piege', 12: 'chalutier', 13: 'stupeur', 14: 'vindeux', 15: 'boufbos', 16: 'feanor', 17: 'solfatare', 18: 'lucrane', 19: 'brutopak', 20: 'tacleur', 21: 'roukouto', 22: 'pryssion', 23: 'morph', 24: 'gruche', 25: 'nefileuse', 26: 'zombruth', 27: 'glyphe', 28: 'sak', 29: 'repli', 30: 'ecaflipus', 31: '' },
    10: { 1: 'kerigoule', 2: 'shigekax', 3: 'drakoalak', 4: 'minikrone', 5: 'demoloch', 6: 'diffusion', 7: 'tainela', 8: 'croleur', 9: 'fongeur', 10: 'ekarlatte', 11: 'ratrapry', 12: 'kaboom', 13: 'kwak', 14: 'halouine', 15: 'ombre', 16: 'chouque', 17: 'trefle', 18: 'tynril', 19: 'gobaladee', 20: 'outrage', 21: 'repulsif', 22: 'prysmaru', 23: 'gourlo', 24: 'ectorche', 25: 'afflux', 26: 'rempotage', 27: 'eau', 28: 'turquoise', 29: 'megabombe', 30: 'wakfu', 31: 'sramourai' },
    11: { 1: 'chacha', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '' },
    12: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: 'nowel', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '31' }
  };

  return {
    number: num,
    word: words[month][day]
  };
}

/**
 * Returns the list of all words in the dictionary in the given length
 * @param {number} length
 * @returns {Array[string]}
 */
function getDictionary(length, dictionary) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `/data/partial/${dictionary}${length}`, false);
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
