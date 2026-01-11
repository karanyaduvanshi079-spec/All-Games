const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let board = Array(9).fill(null);
let current = "X";
let gameOver = false;

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function render(){
  boardEl.innerHTML = "";
  board.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.className = "cell" + (val ? ` ${val.toLowerCase()}` : "");
    cell.textContent = val || "";
    cell.addEventListener("click", () => play(i));
    boardEl.appendChild(cell);
  });
}

function play(i){
  if(board[i] || gameOver) return;

  board[i] = current;
  render();

  if(checkWin()){
    statusEl.innerHTML = `Winner: <span class="${current.toLowerCase()}">${current}</span>`;
    gameOver = true;
    return;
  }

  if(board.every(Boolean)){
    statusEl.innerHTML = "🤝 Draw!";
    gameOver = true;
    return;
  }

  current = current === "X" ? "O" : "X";
  statusEl.innerHTML = `Turn: <span class="${current.toLowerCase()}">${current}</span>`;
}

function checkWin(){
  for(const [a,b,c] of wins){
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      highlight([a,b,c]);
      return true;
    }
  }
  return false;
}

function highlight(cells){
  [...boardEl.children].forEach((cell,i)=>{
    if(cells.includes(i)) cell.classList.add("win");
  });
}

restartBtn.addEventListener("click", () => {
  board = Array(9).fill(null);
  current = "X";
  gameOver = false;
  statusEl.innerHTML = `Turn: <span class="x">X</span>`;
  render();
});

render();
