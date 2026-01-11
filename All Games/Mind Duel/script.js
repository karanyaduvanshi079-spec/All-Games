const EMOJIS = ["🐶","🐱","🦊","🐼","🦁","🐯","🐸","🐵","🐙","🦄","🐝","🦋","🐢","🐬"];
const PAIRS_PER_LEVEL = [4,6,8,10,12];

let maxLevels = 3;
let level = 1;
let currentPlayer = 1;
let totalScore = {1:0, 2:0};

let first = null;
let second = null;
let lock = false;

const board = document.getElementById("board");
const turnEl = document.getElementById("turn");
const p1El = document.getElementById("p1");
const p2El = document.getElementById("p2");
const winnerEl = document.getElementById("winner");
const levelSelect = document.getElementById("levelSelect");

function shuffle(arr){
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildBoard(){
  board.innerHTML = "";
  first = second = null;
  lock = false;

  const pairs = PAIRS_PER_LEVEL[level - 1];
  const icons = shuffle([...EMOJIS]).slice(0, pairs);
  const deck = shuffle([...icons, ...icons]);

  const cols = Math.ceil(Math.sqrt(deck.length));
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  deck.forEach(icon => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.icon = icon;
    card.innerHTML = `
      <div class="inner">
        <div class="face front">${icon}</div>
        <div class="face back">?</div>
      </div>
    `;
    card.onclick = () => flip(card);
    board.appendChild(card);
  });
}

function flip(card){
  if(lock || card === first || card.classList.contains("matched")) return;

  card.classList.add("flipped");

  if(!first){
    first = card;
    return;
  }
  second = card;
  check();
}

function check(){
  lock = true;

  if(first.dataset.icon === second.dataset.icon){
    first.classList.add("matched", currentPlayer === 1 ? "blue" : "red");
    second.classList.add("matched", currentPlayer === 1 ? "blue" : "red");
    totalScore[currentPlayer]++;
    updateScore();
  }

  setTimeout(() => {
    if(!first.classList.contains("matched")){
      first.classList.remove("flipped");
      second.classList.remove("flipped");
    }
    resetTurn();
    switchTurn();

    if(document.querySelectorAll(".matched").length === board.children.length){
      nextLevel();
    }
  }, 700);
}

function resetTurn(){
  first = second = null;
  lock = false;
}

function switchTurn(){
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  turnEl.textContent = `Player ${currentPlayer}`;
  turnEl.className = `turn ${currentPlayer === 1 ? "blue" : "red"}`;
}

function updateScore(){
  p1El.textContent = totalScore[1];
  p2El.textContent = totalScore[2];
}

function nextLevel(){
  if(level < maxLevels){
    level++;
    buildBoard();
  } else {
    declareWinner();
  }
}

function declareWinner(){
  if(totalScore[1] > totalScore[2]){
    winnerEl.textContent = "🏆 FINAL WINNER: PLAYER 1";
    winnerEl.className = "winner blue";
  } else if(totalScore[2] > totalScore[1]){
    winnerEl.textContent = "🏆 FINAL WINNER: PLAYER 2";
    winnerEl.className = "winner red";
  } else {
    winnerEl.textContent = "🤝 FINAL RESULT: DRAW";
  }
}

document.getElementById("restart").onclick = () => {
  level = 1;
  maxLevels = parseInt(levelSelect.value);
  totalScore = {1:0, 2:0};
  updateScore();
  currentPlayer = 1;
  turnEl.className = "turn blue";
  winnerEl.textContent = "";
  buildBoard();
};

maxLevels = parseInt(levelSelect.value);
buildBoard();
