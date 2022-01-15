const WALL = document.getElementById("wall");
const BALL = document.getElementById("ball");
const BEST = document.getElementById("best");
const SCORE = document.getElementById("score");
const OVERLAY = document.getElementById("overlay");
const ROOT = document.querySelector(":root");

let [best, score, size, ball_hue] = [
  localStorage.getItem("best") || 0,
  0,
  15,
  0,
];

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service_worker.js");
}

initGame();

/* ------------------------------------------------------ */

function initGame() {
  BEST.textContent = best;

  document.body.addEventListener("click", handleTap);
  document.getElementById("play").addEventListener("click", startGame);
}

function resetGame() {
  [score, size, ball_hue] = [0, 15, 0];

  SCORE.textContent = score;
  ROOT.style.setProperty("--ball-size", `${size}vw`);
  ROOT.style.setProperty("--ball-hue", ball_hue);
  ROOT.style.setProperty("--wall-hue", ball_hue + 180);
}

function startGame(event) {
  event.stopPropagation();

  resetGame();

  BALL.classList.toggle("stationary");
  OVERLAY.classList.add("close");
}

function stopGame() {
  BALL.classList.add("stationary");

  score > best && updateBest();

  OVERLAY.classList.remove("close");
}

function handleTap() {
  if (isColliding(BALL.getBoundingClientRect(), WALL.getBoundingClientRect())) {
    updateScore();
    updateWall();

    score % 10 == 0 && updateLevel();
  } else {
    stopGame();
  }
}

function isColliding(box1, box2) {
  return !(box1.left > box2.right || box1.right < box2.left);
}

function updateWall() {
  WALL.style.left = `${15 + Math.random() * 55}vw`;
  ROOT.style.setProperty("--wall-width", `${10 + Math.random() * 15}vw`);
}

function updateLevel() {
  ball_hue = ball_hue + 72;
  size = Math.max(5, size - 1);

  ROOT.style.setProperty("--ball-hue", ball_hue);
  ROOT.style.setProperty("--wall-hue", ball_hue + 180);
  ROOT.style.setProperty("--ball-size", `${size}vw`);
}

function updateScore() {
  score += 1;
  SCORE.textContent = score;
}

function updateBest() {
  localStorage.setItem("best", score);
  best = score;
  BEST.textContent = score;
}
