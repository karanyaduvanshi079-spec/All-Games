const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const GOAL_H = 100;
const GOAL_TOP = H/2 - GOAL_H/2;
const GOAL_BOTTOM = H/2 + GOAL_H/2;

let keys = {};
let paused = false;
let running = false;
let timeLeft = 0;
let lastTick = Date.now();

const ball = { x:W/2, y:H/2, vx:0, vy:0, r:8 };
const p1 = { x:200, y:H/2, vx:0, vy:0, r:12, c:"#00cfff", score:0 };
const p2 = { x:600, y:H/2, vx:0, vy:0, r:12, c:"#ff4040", score:0 };

const ui = document.getElementById("ui");
const overlay = document.getElementById("overlay");
const goalPop = document.getElementById("goalPop");
const result = document.getElementById("result");
const finalScore = document.getElementById("finalScore");
const timeInput = document.getElementById("timeInput");

addEventListener("keydown", e => {
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){
    e.preventDefault();
  }
  if(e.key === "p" || e.key === "P") togglePause();
  keys[e.key] = true;
});

addEventListener("keyup", e => keys[e.key] = false);

function showGoal(text){
  goalPop.textContent = text;
  goalPop.style.display = "flex";
  setTimeout(()=>goalPop.style.display="none",1000);
}

function resetPlayers(){
  p1.x=200; p1.y=H/2; p1.vx=p1.vy=0;
  p2.x=600; p2.y=H/2; p2.vx=p2.vy=0;
}

function resetBall(){
  ball.x=W/2; ball.y=H/2; ball.vx=ball.vy=0;
}

function startMatch(){
  timeLeft = parseInt(timeInput.value) || 60;
  p1.score = p2.score = 0;
  paused = false;
  running = true;
  resetPlayers();
  resetBall();
  lastTick = Date.now();
  ui.style.display = "none";
  overlay.style.display = "none";
}

function togglePause(){
  if(!running) return;
  paused = !paused;
  showGoal(paused ? "⏸ PAUSED" : "▶ PLAY");
  lastTick = Date.now();
}

function restartMatch(){
  paused = false;
  running = true;
  timeLeft = parseInt(timeInput.value) || 60;
  p1.score = p2.score = 0;
  resetPlayers();
  resetBall();
  lastTick = Date.now();
  overlay.style.display = "none";
}

function keyboard(p,u,d,l,r){
  const acc=0.35, max=2.2, fr=0.85;
  if(keys[u]) p.vy -= acc;
  if(keys[d]) p.vy += acc;
  if(keys[l]) p.vx -= acc;
  if(keys[r]) p.vx += acc;
  p.vx *= fr; p.vy *= fr;
  const s = Math.hypot(p.vx,p.vy);
  if(s > max){
    p.vx = p.vx/s*max;
    p.vy = p.vy/s*max;
  }
}

function clamp(p){
  p.x = Math.max(p.r, Math.min(W-p.r, p.x));
  p.y = Math.max(p.r, Math.min(H-p.r, p.y));
}

function resolvePlayers(a,b){
  const dx=b.x-a.x, dy=b.y-a.y;
  const dist=Math.hypot(dx,dy);
  const min=a.r+b.r;
  if(dist<min && dist){
    const o=(min-dist)/2;
    const nx=dx/dist, ny=dy/dist;
    a.x-=nx*o; a.y-=ny*o;
    b.x+=nx*o; b.y+=ny*o;
  }
}

function resolveBall(p){
  const dx=ball.x-p.x, dy=ball.y-p.y;
  const dist=Math.hypot(dx,dy);
  const min=p.r+ball.r;
  if(dist<min && dist){
    const o=min-dist;
    ball.x+=dx/dist*o;
    ball.y+=dy/dist*o;
    ball.vx*=0.9; ball.vy*=0.9;
  }
}

function autoKick(p){
  const dx=ball.x-p.x, dy=ball.y-p.y;
  const d=Math.hypot(dx,dy);
  if(d<p.r+ball.r+2 && d){
    const pow=3.5;
    ball.vx=dx/d*pow;
    ball.vy=dy/d*pow;
  }
}

function update(){
  if(!running || paused) return;

  if(Date.now()-lastTick>=1000){
    timeLeft--;
    lastTick = Date.now();
  }

  if(timeLeft<=0){
    running=false;
    overlay.style.display="flex";
    if(p1.score>p2.score) result.textContent="BLUE WINS 💙";
    else if(p2.score>p1.score) result.textContent="RED WINS ❤️";
    else result.textContent="DRAW 🤝";
    finalScore.textContent=`Final Score: ${p1.score} : ${p2.score}`;
    return;
  }

  keyboard(p1,"w","s","a","d");
  keyboard(p2,"ArrowUp","ArrowDown","ArrowLeft","ArrowRight");

  p1.x+=p1.vx; p1.y+=p1.vy;
  p2.x+=p2.vx; p2.y+=p2.vy;

  resolvePlayers(p1,p2);
  clamp(p1); clamp(p2);

  resolveBall(p1);
  resolveBall(p2);
  autoKick(p1);
  autoKick(p2);

  ball.x+=ball.vx; ball.y+=ball.vy;
  ball.vx*=0.98; ball.vy*=0.98;

  if(ball.x-ball.r<=0 && ball.y>GOAL_TOP && ball.y<GOAL_BOTTOM){
    p2.score++;
    showGoal("GOAL ❤️");
    resetPlayers(); resetBall();
  }
  if(ball.x+ball.r>=W && ball.y>GOAL_TOP && ball.y<GOAL_BOTTOM){
    p1.score++;
    showGoal("GOAL 💙");
    resetPlayers(); resetBall();
  }
}

function draw(){
  ctx.clearRect(0,0,W,H);

  ctx.strokeStyle="#fff";
  ctx.beginPath();
  ctx.moveTo(W/2,0);
  ctx.lineTo(W/2,H);
  ctx.stroke();

  ctx.strokeRect(0,GOAL_TOP,10,GOAL_H);
  ctx.strokeRect(W-10,GOAL_TOP,10,GOAL_H);

  ctx.fillStyle=p1.c;
  ctx.beginPath();
  ctx.arc(p1.x,p1.y,p1.r,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle=p2.c;
  ctx.beginPath();
  ctx.arc(p2.x,p2.y,p2.r,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle="#fff";
  ctx.beginPath();
  ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
  ctx.fill();

  ctx.font="20px Arial";
  ctx.fillText(`Time: ${timeLeft}s`, W/2-45, 30);

  ctx.font="22px Arial";
  ctx.fillText(`${p1.score} : ${p2.score}`, W/2-22, 60);
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();