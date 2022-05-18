const DELETE_CHAR = '⌫';
const ENTER_CHAR = '↲';

window.addEventListener("load", () => {
  loadKeyboard();
});

function loadKeyboard(correctLetters = [], otherLetters = []) {
  const layout = 'azerty'; // TODO add layouts
  const layouts = {
    'azerty': [
      ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
      ['.', 'W', 'X', 'C', 'V', 'B', 'N', DELETE_CHAR, ENTER_CHAR]
    ]
  };
  const areaEl = document.querySelector('#input-area');
  areaEl.innerHTML = '';
  for (let i = 0; i < layouts[layout].length; i++) {
    const lineEl = document.createElement('div');
    lineEl.classList.add('input-line');
    for (let j = 0; j < layouts[layout][i].length; j++) {
      const letterEl = document.createElement('div');
      letterEl.innerText = layouts[layout][i][j];
      letterEl.classList.add('input-letter');
      if (correctLetters.indexOf(layouts[layout][i][j]) >= 0) {
        letterEl.classList.add('correct-letter');
      } else if (otherLetters.indexOf(layouts[layout][i][j]) >= 0) {
        letterEl.classList.add('other-letter');
      }
      lineEl.appendChild(letterEl);
    }
    areaEl.appendChild(lineEl);
  }
}
