const DELETE_CHAR = '⌫';
const ENTER_CHAR = '↲';

function loadKeyboard(gameData, correctLetters = [], otherLetters = [], wrongLetters = []) {
  const layout = 'azerty';
  const layouts = {
    'azerty': [
      ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
      ['.', 'W', 'X', 'C', 'V', 'B', 'N', 'delete', 'enter']
    ]
  };
  const chars = { 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G', 'H': 'H', 'I': 'I', 'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R', 'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z', '.': '.', 'enter': ENTER_CHAR, 'delete': DELETE_CHAR };

  const areaEl = document.querySelector('#input-area');
  areaEl.innerHTML = '';

  for (let i = 0; i < layouts[layout].length; i++) {
    const lineEl = document.createElement('div');
    lineEl.classList.add('input-line');
    for (let j = 0; j < layouts[layout][i].length; j++) {
      const letter = layouts[layout][i][j];
      const letterEl = document.createElement('div');
      letterEl.innerText = chars[letter];
      letterEl.dataset.letter = letter;
      letterEl.classList.add('input-letter');
      if (correctLetters.indexOf(letter) >= 0) {
        letterEl.classList.add('correct-letter');
      } else if (otherLetters.indexOf(letter) >= 0) {
        letterEl.classList.add('other-letter');
      } else if (wrongLetters.indexOf(letter) >= 0) {
        letterEl.classList.add('wrong-letter');
      }
      letterEl.addEventListener('click', (event) => {
        if (gameData.win || gameData.lose) return;

        const letter = event.target.dataset.letter;
        if (letter === 'enter') {
          validateWord(gameData);
        } else if (letter === 'delete') {
          removeLetter(gameData);
        } else {
          addLetter(gameData, letter);
        }
        loadGrid(gameData);
        updateGame(gameData);
      });
      lineEl.appendChild(letterEl);
    }
    areaEl.appendChild(lineEl);
  }
}
