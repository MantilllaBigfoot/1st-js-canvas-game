const gameAudio = new Audio('/src/sounds/GameMusic.mp3');
const startTitleAudio = new Audio('/src/sounds/TitleScreenMusic.mp3');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const startScreenElement = document.getElementById('start-screen');
const playingScreenElement = document.getElementById('playing-screen');
const endScreenElement = document.getElementById('game-over-screen');
const startButton = startScreenElement.querySelector('span');
const tryAgainButton = endScreenElement.querySelector('span');

const screenElements = {
  start: startScreenElement,
  playing: playingScreenElement,
  end: endScreenElement
};

startScreenElement.addEventListener('mousemove', function () {
  startTitleAudio.muted = false;
  startTitleAudio.loop = true;
  startTitleAudio.play();
});

const gameLevel = new GameLevel(canvas, context, screenElements);

startButton.addEventListener('click', () => {
  gameLevel.start();
});

tryAgainButton.addEventListener('click', () => {
  gameLevel.start();
});
