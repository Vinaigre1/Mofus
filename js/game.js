const MAXIMUM_TRIES = 6;

window.addEventListener('load', () => {
  const {word, number} = getWordOfTheDay();

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

  const startDate = new Date(2022, 4, 20);
  const num = Math.floor(daysBetween(startDate, new Date()));
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const words = {
    1: { 1: 'kardorim', 2: 'bwak', 3: 'dathura', 4: 'arcanique', 5: 'pwak', 6: 'tryde', 7: 'mallefisk', 8: 'barricade', 9: 'folle', 10: 'misereux', 11: 'robionicle', 12: 'lenald', 13: 'pandora', 14: 'teleglyphe', 15: 'panterreur', 16: 'trukikol', 17: 'sufokien', 18: 'contraction', 19: 'merisier', 20: 'malbois', 21: 'toxine', 22: 'pandawushu', 23: 'malter', 24: 'dragoss', 25: 'virus', 26: 'brassage', 27: 'boulglours', 28: 'vivifiant', 29: 'vashkiwi', 30: 'milicien', 31: 'remblai' },
    2: { 1: 'trepavois', 2: 'nausee', 3: 'drain', 4: 'represaille', 5: 'citwouille', 6: 'corailleur', 7: 'dragodinde', 8: 'fuite', 9: 'blopignon', 10: 'chakanoubis', 11: 'abrakadabra', 12: 'graboule', 13: 'pilori', 14: 'bavdur', 15: 'chachachovage', 16: 'ressac', 17: 'force', 18: 'aurore', 19: 'petunia', 20: 'barbetoal', 21: 'grokillage', 22: 'larve', 23: 'kolizeum', 24: 'toxoliath', 25: 'gargrouille', 26: 'carnage', 27: 'feroce', 28: 'debandade', 29: 'pain', 30: '', 31: '' },
    3: { 1: 'perfidie', 2: 'dagob', 3: 'surtension', 4: 'sapik', 5: 'emprise', 6: 'macrab', 7: 'vortex', 8: 'halbardent', 9: 'srambad', 10: 'projection', 11: 'pandatak', 12: 'pugilat', 13: 'mousquet', 14: 'torpille', 15: 'guerre', 16: 'grenaille', 17: 'abolition', 18: 'flamiche', 19: 'lotus', 20: 'pilon', 21: 'paspartou', 22: 'cania', 23: 'susej', 24: 'servitude', 25: 'geyser', 26: 'iop', 27: 'rokoram', 28: 'buboxor', 29: 'piktenia', 30: 'zoth', 31: 'goultard' },
    4: { 1: 'farfacette', 2: 'mufafah', 3: 'boufmouth', 4: 'gligli', 5: 'krobe', 6: 'quisnoa', 7: 'moon', 8: 'kayouloud', 9: 'sabordage', 10: 'dondussang', 11: 'xelorium', 12: 'corrompu', 13: 'contraction', 14: 'mercenaire', 15: 'astrub', 16: 'kimbo', 17: 'trukipik', 18: 'scordion', 19: 'percutante', 20: 'boomerang', 21: 'detonateur', 22: 'fouet', 23: 'kilibriss', 24: 'cadeau', 25: 'pounicheur', 26: 'shamansot', 27: 'deluge', 28: 'amlub', 29: 'damadrya', 30: 'kankreblath', 31: '' },
    5: { 1: 'fragmentation', 2: 'dispertion', 3: 'puissant', 4: 'dolmanax', 5: 'bloqueur', 6: 'esprigne', 7: 'champa', 8: 'porkzebuth', 9: 'forcene', 10: 'contre', 11: 'greuvette', 12: 'brumen', 13: 'fumrirolle', 14: 'dokille', 15: 'ankama', 16: 'flasque', 17: 'surpuissante', 18: 'brakmar', 19: 'sparo', 20: 'cadran', 21: 'gamino', 22: 'kwakwa', 23: 'dynamo', 24: 'sidimote', 25: 'collant', 26: 'koumiho', 27: 'fantomat', 28: 'libation', 29: 'amarage', 30: 'pandawa', 31: 'levitrof' },
    6: { 1: 'biblop', 2: 'harpille', 3: 'meno', 4: 'douzdoa', 5: 'tetanie', 6: 'blop', 7: 'dague', 8: 'assaut', 9: 'goulafre', 10: 'vetauran', 11: 'buveur', 12: 'atonie', 13: 'meulou', 14: 'vindicte', 15: 'yechti', 16: 'ginga', 17: 'envol', 18: 'orichor', 19: 'tourelle', 20: 'furia', 21: 'cuirasse', 22: 'vertu', 23: 'butor', 24: 'vulkania', 25: 'frigost', 26: 'wobot', 27: 'horize', 28: 'soryo', 29: 'nagate', 30: 'prytek', 31: '' },
    7: { 1: 'creation', 2: 'akwadala', 3: 'bombance', 4: 'compas', 5: 'imorok', 6: 'ouilleur', 7: 'grisou', 8: 'kawaii', 9: 'rappel', 10: 'gourlo', 11: 'peur', 12: 'prygen', 13: 'olgoth', 14: 'ocre', 15: 'arcanin', 16: 'dragon', 17: 'ethylo', 18: 'menace', 19: 'kwoan', 20: 'bouflouth', 21: 'gloot', 22: 'meupette', 23: 'maree', 24: 'trithon', 25: 'krokille', 26: 'choudini', 27: 'tison', 28: 'vetauran', 29: 'derobade', 30: 'erudit', 31: 'karne' },
    8: { 1: 'noctulule', 2: 'septange', 3: 'malterego', 4: 'grasmera', 5: 'pelage', 6: 'lifo', 7: 'nomekop', 8: 'espingole', 9: 'bouclier', 10: 'raillerie', 11: 'kanniboul', 12: 'nelween', 13: 'paradoxe', 14: 'feu', 15: 'synchro', 16: 'stimulant', 17: 'blerice', 18: 'robuste', 19: 'hardi', 20: 'mystique', 21: 'warko', 22: 'douzdoa', 23: 'eliotrope', 24: 'crapaud', 25: 'momistik', 26: 'milirat', 27: 'kaniglou', 28: 'arc', 29: 'cactana', 30: 'pandanlku', 31: 'hakam' },
    9: { 1: 'dofus', 2: 'tiwabbit', 3: 'pikbul', 4: 'silf', 5: 'gambaf', 6: 'yomi', 7: 'versatile', 8: 'misere', 9: 'armutin', 10: 'vertige', 11: 'piege', 12: 'chalutier', 13: 'stupeur', 14: 'vindeux', 15: 'boufbos', 16: 'feanor', 17: 'solfatare', 18: 'lucrane', 19: 'brutopak', 20: 'tacleur', 21: 'roukouto', 22: 'pryssion', 23: 'morph', 24: 'gruche', 25: 'nefileuse', 26: 'zombruth', 27: 'glyphe', 28: 'sak', 29: 'repli', 30: 'ecaflipus', 31: '' },
    10: { 1: 'kerigoule', 2: 'shigekax', 3: 'drakoalak', 4: 'minikrone', 5: 'demoloch', 6: 'diffusion', 7: 'tainela', 8: 'croleur', 9: 'fongeur', 10: 'ekarlatte', 11: 'ratrapry', 12: 'kaboom', 13: 'kwak', 14: 'halouine', 15: 'ombre', 16: 'chouque', 17: 'trefle', 18: 'tynril', 19: 'gobaladee', 20: 'outrage', 21: 'repulsif', 22: 'prysmaru', 23: 'gourlo', 24: 'ectorche', 25: 'afflux', 26: 'rempotage', 27: 'eau', 28: 'turquoise', 29: 'megabombe', 30: 'wakfu', 31: 'sramourai' },
    11: { 1: 'chacha', 2: 'leolhyene', 3: 'houblon', 4: 'souvenir', 5: 'ganymede', 6: 'roublard', 7: 'galvanisant', 8: 'desinvocation', 9: 'erazal', 10: 'epidemie', 11: 'courtilieur', 12: 'gibier', 13: 'immature', 14: 'aboub', 15: 'fendoir', 16: 'barriere', 17: 'nipul', 18: 'melanique', 19: 'nautile', 20: 'aperiglours', 21: 'torkelonia', 22: 'bihilete', 23: 'cruaute', 24: 'dagon', 25: 'aprybou', 26: 'porsalu', 27: 'crocoburio', 28: 'dolid', 29: 'kanigroula', 30: 'chasquatch', 31: '' },
    12: { 1: 'wowabbit', 2: 'hijacob', 3: 'barbare', 4: 'cranonier', 5: 'albinos', 6: 'arakne', 7: 'nowel', 8: 'farouche', 9: 'prymune', 10: 'elpiko', 11: 'grath', 12: 'litneg', 13: 'wa', 14: 'coalition', 15: 'injection', 16: 'monolithe', 17: 'ouragan', 18: 'morfrelon', 19: 'lolojiki', 20: 'fraktale', 21: 'palmifleur', 22: 'obliteration', 23: 'panique', 24: 'caznoar', 25: 'martegel', 26: 'bouftou', 27: 'ambiguman', 28: 'nheurgueule', 29: 'amlub', 30: 'tivelo', 31: 'sacrifiee' }
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
  xhr.open('GET', `./data/partial/${dictionary}${length}.txt`, false);
  xhr.send();
  if (xhr.status === 200) {
    return xhr.responseText.split('\n').filter(n => n);
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
      event.preventDefault(); // Avoids scrolling down the page with spacebar
    } else if (key === 'backspace') {
      removeLetter(gameData);
    } else if (key === 'enter') {
      if (!validateWord(gameData)) return;
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
  if (gameData.cursor[1] < gameData.word.length) {
    animateShakeRow(gameData.cursor[0] + 1);
    return false;
  }

  const entry = gameData.entries[gameData.cursor[0]].join('').toLowerCase();
  const check = checkDictionary(gameData, entry);
  if (!check.exists) {
    animateShakeRow(gameData.cursor[0] + 1);
    return false;
  }
  gameData.entryDict[gameData.cursor[0]] = check.dofus;

  gameData.results[gameData.cursor[0]] = checkWord(gameData.word, entry);
  if (gameData.results[gameData.cursor[0]].indexOf(0) === -1 && gameData.results[gameData.cursor[0]].indexOf(1) === -1) {
    gameData.win = true;
    updateStats(gameData);
    loadWinPanel(gameData);
  } else if (gameData.cursor[0] + 1 >= MAXIMUM_TRIES) {
    gameData.lose = true;
    updateStats(gameData);
    loadLosePanel(gameData);
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
  return true;
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
  const length = gameData.win ? gameData.cursor[0]+1 : '-';

  let str = `MOFUS n°${gameData.number} : ${length}/6\nMots Dofus : ${dofus}\n\n`;
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
  str += window.location.href;

  const messageNode = document.querySelector('.share-message')
  if (!navigator.clipboard) {
    messageNode.innerHTML = 'Impossible de copier dans le presse-papier.';
  } else {
    navigator.clipboard.writeText(str, () => {
      messageNode.innerHTML = 'Copié dans le presse-papier !';
    }, () => {
      messageNode.innerHTML = 'Impossible de copier dans le presse-papier.';
    });
  }
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
    'results': {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '-': 0
    },
    'streak': 0,
    'maxStreak': 0,
    'normalWords': 0,
    'dofusWords': 0
  };
  const game = JSON.parse(localStorage.getItem('game')) || {
    'date': new Date().getTime(),
    'words': [],
    'state': 'in_progress'
  };
  const numberOfTries = gameData.cursor[0] + 1;

  if (game.state !== 'in_progress') return;

  if (!gameData.lose && numberOfTries >= 1 && numberOfTries <= 6) {
    stats.results[numberOfTries]++;
    stats.streak++;
    game.state = 'win';
  } else {
    stats.results['-']++;
    stats.streak = 0;
    game.state = 'lose';
  }
  stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
  stats.normalWords += gameData.entryDict.filter(n => !n).length;
  stats.dofusWords += gameData.entryDict.filter(n => n).length;

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
  if (!game) {
    localStorage.setItem('game', JSON.stringify(
      {
        'date': new Date().getTime(),
        'words': [],
        'state': 'in_progress'
      }
    ));
    loadHelpPanel();
    return;
  }

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

/**
 * Return the stats of the user using localStorage infos
 * @return {Object}
 */
function getAllStats() {
  const storedStats = JSON.parse(localStorage.getItem('stats'));
  if (!storedStats) return;

  const totalGames = Object.keys(storedStats.results).reduce((pre, key) => Number(pre) + storedStats.results[key], 0);
  const totalWin = Object.keys(storedStats.results).reduce((pre, key) => Number(pre) + (key === '-' ? 0 : storedStats.results[key]), 0);

  return {
    games: totalGames,
    ratio: totalWin / totalGames,
    results: {
      fixed: storedStats.results,
      ratios: {
        '1': storedStats.results['1'] / totalGames,
        '2': storedStats.results['2'] / totalGames,
        '3': storedStats.results['3'] / totalGames,
        '4': storedStats.results['4'] / totalGames,
        '5': storedStats.results['5'] / totalGames,
        '6': storedStats.results['6'] / totalGames,
        '-': storedStats.results['-'] / totalGames
      }
    },
    words: {
      total: storedStats.normalWords + storedStats.dofusWords,
      dofus: storedStats.dofusWords,
      normal: storedStats.normalWords,
      ratio: storedStats.dofusWords / (storedStats.normalWords + storedStats.dofusWords)
    },
    streak: {
      current: storedStats.streak,
      max: storedStats.maxStreak
    }
  };
}

// TODO: iframe integration
