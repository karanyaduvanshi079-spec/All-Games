document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let player;
  let blocks = [];
  let score = 0;
  let speed = 2;
  let running = false;
  let gameOver = false;
  let keys = { left: false, right: false };

  
  function initGame() {
    player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 40,
      w: 50,
      h: 15,
      speed: 6
    };

    blocks = [];
    score = 0;
    speed = 2;
    gameOver = false;
    running = true;

    gameLoop();
  }

  
  function restartGame() {
    running = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#06b6d4";
    ctx.font = "20px sans-serif";
    ctx.fillText("Press Start to Play Again", 280, 250);
  }

  
  function spawnBlock() {
    const size = 30;
    blocks.push({
      x: Math.random() * (canvas.width - size),
      y: -30,
      w: size,
      h: size
    });
  }

  
  function update() {
    if (!running || gameOver) return;

    score += 0.1;
    speed += 0.002;

    if (keys.left && player.x > 0) player.x -= player.speed;
    if (keys.right && player.x + player.w < canvas.width) player.x += player.speed;

    if (Math.random() < 0.03) spawnBlock();
    blocks.forEach(b => b.y += speed);

   
    for (let b of blocks) {
      if (
        b.x < player.x + player.w &&
        b.x + b.w > player.x &&
        b.y < player.y + player.h &&
        b.y + b.h > player.y
      ) {
        gameOver = true;
        running = false;
      }
    }

    blocks = blocks.filter(b => b.y < canvas.height + 40);
  }

  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   
    ctx.font = "32px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("😘", player.x + player.w / 2, player.y + player.h / 2);

  
    ctx.font = "28px serif";
    blocks.forEach(b => {
      ctx.fillText("💣", b.x + b.w / 2, b.y + b.h / 2);
    });

    
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "white";
    ctx.font = "18px sans-serif";
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 30);

    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = "60px serif";
      ctx.fillText("💥", canvas.width / 2, canvas.height / 2 - 40);

      ctx.fillStyle = "#f87171";
      ctx.font = "28px sans-serif";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 + 20);

      ctx.fillStyle = "white";
      ctx.font = "20px sans-serif";
      ctx.fillText(
        `Final Score: ${Math.floor(score)}`,
        canvas.width / 2,
        canvas.height / 2 + 55
      );
    }
  }

  
  function gameLoop() {
    update();
    draw();
    if (running) requestAnimationFrame(gameLoop);
  }


  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
    if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
  });

  window.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
  });

 
  document.getElementById("startBtn").addEventListener("click", () => {
    if (!running) initGame();
  });

  document.getElementById("restartBtn").addEventListener("click", restartGame);

  
  ctx.fillStyle = "#06b6d4";
  ctx.font = "20px sans-serif";
  ctx.fillText("Press Start to Begin", 300, 250);

});