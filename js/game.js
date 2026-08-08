(() => {
  /* ═══════════════════════════════════════════
     Nada's Birthday Balloon Pop Game
     ═══════════════════════════════════════════ */

  const TOTAL = 28;
  const BALLOON_COLORS = [
    '#F2A5B5', '#E8879B', '#D4A96A', '#C9A84C',
    '#FFDDE1', '#C4647A', '#F0DFC0', '#FFB7B2',
    '#B5D8CC', '#A8C9E2', '#D5B8E8', '#F5C6A0'
  ];

  const WISHES = [
    "May your smile never fade 🌟",
    "May every sunset be as stunning as you 🌅",
    "May your phone always be fully charged 🔋",
    "May life give you more reasons to laugh 😄",
    "May your heart always be full of peace 🕊️",
    "May you always find the perfect outfit on the first try 👗",
    "May your coffee always hit different ☕",
    "May every mirror remind you how beautiful you are 🪞",
    "May your playlist always match your mood 🎶",
    "May your dreams be bigger than your fears 💭",
    "May you always have someone to share dessert with 🍰",
    "May your selfies always be first-take perfection 📸",
    "May kindness follow you everywhere you go 🌻",
    "May your inner light never dim ✨",
    "May you wake up every morning feeling grateful 🌤️",
    "May you travel to every place you've dreamed of 🗺️",
    "May your hugs always feel like home 🏠",
    "May your next year be your best chapter yet 📖",
    "May you laugh until your cheeks hurt — often 😂",
    "May you always know how deeply you're loved 💗",
    "May your courage always be louder than your doubt 🦁",
    "May the universe always conspire in your favor 🌌",
    "May your skin always be glowing without even trying 💫",
    "May you find magic in ordinary moments 🦋",
    "May your friendships only grow deeper with time 🤝",
    "May your birthday cake always have extra frosting 🎂",
    "May you never run out of things to be excited about 🎉",
    "Happy 28th, beautiful soul — the best is yet to come 🥂"
  ];

  let popped = 0;
  let balloons = [];
  let gameStarted = false;
  let gameWon = false;
  let wishQueue = [...WISHES].sort(() => Math.random() - 0.5);

  // DOM elements
  const gameArea = document.getElementById('game-area');
  const startOverlay = document.getElementById('game-start');
  const victoryOverlay = document.getElementById('game-victory');
  const startBtn = document.getElementById('start-game-btn');
  const playAgainBtn = document.getElementById('play-again-btn');
  const progressText = document.getElementById('progress-text');
  const progressFill = document.querySelector('.progress-ring-fill');
  const wishCard = document.getElementById('wish-card');
  const wishBackdrop = document.getElementById('wish-backdrop');
  const wishNumber = document.getElementById('wish-number');
  const wishText = document.getElementById('wish-text');
  const wishClose = document.getElementById('wish-close');

  // Guard: if no game area, bail
  if (!gameArea) return;

  const circumference = 2 * Math.PI * 12; // radius 12 in SVG

  function updateProgress() {
    const offset = circumference - (popped / TOTAL) * circumference;
    if (progressFill) progressFill.style.strokeDashoffset = offset;
    if (progressText) progressText.textContent = `${popped}/${TOTAL}`;
  }

  function createBalloon() {
    if (gameWon || popped >= TOTAL) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const body = document.createElement('div');
    body.className = 'balloon-body';
    body.style.background = `radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.4), ${color} 60%)`;
    body.style.color = color;

    const string = document.createElement('div');
    string.className = 'balloon-string';

    balloon.appendChild(body);
    balloon.appendChild(string);

    // Position
    const areaRect = gameArea.getBoundingClientRect();
    const maxLeft = areaRect.width - 60;
    const startLeft = Math.random() * maxLeft;
    balloon.style.left = `${startLeft}px`;
    balloon.style.bottom = `-80px`;

    gameArea.appendChild(balloon);

    // Animation properties
    const speed = Math.random() * 0.6 + 0.3; // px per frame
    const wobbleAmp = Math.random() * 20 + 10;
    const wobbleSpeed = Math.random() * 0.02 + 0.01;
    let posY = -80;
    let frame = Math.random() * 100;

    const balloonObj = { el: balloon, posY, speed, wobbleAmp, wobbleSpeed, frame, alive: true, startLeft };
    balloons.push(balloonObj);

    // Click / tap handler
    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!balloonObj.alive || gameWon) return;
      balloonObj.alive = false;
      balloon.classList.add('popping');
      popped++;
      updateProgress();

      // Show wish
      const wishIdx = popped - 1;
      if (wishIdx < wishQueue.length) {
        showWish(popped, wishQueue[wishIdx]);
      }

      setTimeout(() => {
        if (balloon.parentNode) balloon.parentNode.removeChild(balloon);
      }, 400);

      if (popped >= TOTAL) {
        gameWon = true;
        setTimeout(triggerVictory, 1800);
      }
    });
  }

  function showWish(num, text) {
    wishNumber.textContent = `Wish #${num}`;
    wishText.textContent = text;
    wishCard.classList.add('show');
    wishBackdrop.classList.add('show');
  }

  function hideWish() {
    wishCard.classList.remove('show');
    wishBackdrop.classList.remove('show');
  }

  function animateBalloons() {
    if (!gameStarted) return;

    const areaHeight = gameArea.getBoundingClientRect().height;

    for (let i = balloons.length - 1; i >= 0; i--) {
      const b = balloons[i];
      if (!b.alive) continue;

      b.posY += b.speed;
      b.frame++;
      const wobble = Math.sin(b.frame * b.wobbleSpeed) * b.wobbleAmp;

      b.el.style.bottom = `${b.posY}px`;
      b.el.style.left = `${b.startLeft + wobble}px`;

      // If balloon floated off top, reset it
      if (b.posY > areaHeight + 80) {
        b.posY = -80;
        b.startLeft = Math.random() * (gameArea.getBoundingClientRect().width - 60);
      }
    }

    requestAnimationFrame(animateBalloons);
  }

  function spawnBalloons() {
    // Spawn initial batch
    for (let i = 0; i < 8; i++) {
      setTimeout(() => createBalloon(), i * 400);
    }

    // Keep spawning until we have enough active
    const spawnInterval = setInterval(() => {
      if (gameWon) {
        clearInterval(spawnInterval);
        return;
      }
      const activeCount = balloons.filter(b => b.alive).length;
      if (activeCount < 6 && popped < TOTAL) {
        createBalloon();
      }
    }, 1200);
  }

  function triggerVictory() {
    hideWish();

    // Show victory overlay
    if (victoryOverlay) victoryOverlay.classList.remove('hidden');

    // Fire confetti
    launchConfetti();
  }

  function launchConfetti() {
    const colors = ['#E8879B', '#F2A5B5', '#D4A96A', '#C9A84C', '#FFDDE1', '#B5D8CC', '#A8C9E2', '#D5B8E8', '#F5C6A0', '#FFB7B2'];
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = `${Math.random() * 8 + 5}px`;
        piece.style.height = `${Math.random() * 8 + 5}px`;
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = `${Math.random() * 2 + 2}s`;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 4000);
      }, i * 40);
    }
  }

  function resetGame() {
    popped = 0;
    gameWon = false;
    gameStarted = false;
    wishQueue = [...WISHES].sort(() => Math.random() - 0.5);

    // Remove existing balloons
    balloons.forEach(b => { if (b.el.parentNode) b.el.parentNode.removeChild(b.el); });
    balloons = [];

    updateProgress();

    if (victoryOverlay) victoryOverlay.classList.add('hidden');
    if (startOverlay) startOverlay.classList.remove('hidden');
  }

  function startGame() {
    gameStarted = true;
    if (startOverlay) startOverlay.classList.add('hidden');
    if (victoryOverlay) victoryOverlay.classList.add('hidden');
    updateProgress();
    spawnBalloons();
    animateBalloons();
  }

  // Event bindings
  if (startBtn) startBtn.addEventListener('click', startGame);
  if (playAgainBtn) playAgainBtn.addEventListener('click', resetGame);
  if (wishClose) wishClose.addEventListener('click', hideWish);
  if (wishBackdrop) wishBackdrop.addEventListener('click', hideWish);

  // Initialize progress display
  if (progressFill) {
    progressFill.style.strokeDasharray = circumference;
    progressFill.style.strokeDashoffset = circumference;
  }

})();
