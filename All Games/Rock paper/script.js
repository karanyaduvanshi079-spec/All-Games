let mode = 'single';
let bestOf = 3;
let leftScore = 0;
let rightScore = 0;
let logs = [];
let waiting = false;
let firstChoice = null;

const leftVal = document.getElementById('leftVal');
const rightVal = document.getElementById('rightVal');
const infoText = document.getElementById('infoText');
const historyBox = document.getElementById('historyBox');
const popup = document.getElementById('popup');
const modeLabel = document.getElementById('modeLabel');
const leftLabel = document.getElementById('leftLabel');
const rightLabel = document.getElementById('rightLabel');
const modeSingle = document.getElementById('modeSingle');
const modeTwo = document.getElementById('modeTwo');
const bestOfSelect = document.getElementById('bestOf');

function setActive(btn){
  document.querySelectorAll('.mode-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

bestOfSelect.onchange = e => {
  bestOf = parseInt(e.target.value);
  showPopup('New Match Started');
  resetGame();
};

modeSingle.onclick = () => {
  mode = 'single';
  modeLabel.innerText = 'Single';
  leftLabel.innerText = 'Player';
  rightLabel.innerText = 'Computer';
  setActive(modeSingle);
  resetGame();
};

modeTwo.onclick = () => {
  mode = 'two';
  modeLabel.innerText = '2 Player';
  leftLabel.innerText = 'P1';
  rightLabel.innerText = 'P2';
  setActive(modeTwo);
  resetGame();
};

document.getElementById('buttonsRow').onclick = e => {
  const btn = e.target.closest('button');
  if(btn) handleChoice(btn.dataset.choice);
};

document.addEventListener('keydown', e => {
  const map = { r:'rock', p:'paper', s:'scissors' };
  if(map[e.key.toLowerCase()]){
    handleChoice(map[e.key.toLowerCase()]);
  }
});

function handleChoice(choice){
  if(mode === 'single'){
    play(choice, randomChoice(), 'Player', 'Computer');
  } else {
    if(!waiting){
      waiting = true;
      firstChoice = choice;
      infoText.innerText = 'P1 chosen ✔ Pass device to P2';
      showPopup('P1 Locked');
    } else {
      waiting = false;
      play(firstChoice, choice, 'P1', 'P2');
      infoText.innerText = 'Choose (R / P / S)';
    }
  }
}

function play(a, b, aName, bName){
  let msg;
  if(a === b){
    msg = 'DRAW';
  } else if(isWin(a, b)){
    leftScore++;
    msg = `${aName} WINS`;
  } else {
    rightScore++;
    msg = `${bName} WINS`;
  }

  updateUI();
  addLog(`${aName}:${a} | ${bName}:${b} → ${msg}`);
  showPopup(msg);
  checkEnd();
}

function isWin(a, b){
  return (
    (a === 'rock' && b === 'scissors') ||
    (a === 'paper' && b === 'rock') ||
    (a === 'scissors' && b === 'paper')
  );
}

function randomChoice(){
  return ['rock','paper','scissors']
    [Math.floor(Math.random() * 3)];
}

function addLog(text){
  logs.unshift(new Date().toLocaleTimeString() + " — " + text);
  historyBox.innerHTML = logs.join('<br>');
}

function showPopup(text){
  popup.innerText = text;
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 1200);
}

function updateUI(){
  leftVal.innerText = leftScore;
  rightVal.innerText = rightScore;
}

function checkEnd(){
  const need = Math.ceil(bestOf / 2);
  if(leftScore >= need || rightScore >= need){
    const winner =
      leftScore > rightScore ? leftLabel.innerText : rightLabel.innerText;
    showPopup(`${winner} WINS (${leftScore}:${rightScore})`);
    setTimeout(resetGame, 1200);
  }
}

function resetGame(){
  leftScore = 0;
  rightScore = 0;
  logs = [];
  waiting = false;
  updateUI();
  historyBox.innerText = 'History...';
  infoText.innerText = 'Choose Rock / Paper / Scissors (R / P / S)';
}

document.getElementById('resetBtn').onclick = resetGame;
