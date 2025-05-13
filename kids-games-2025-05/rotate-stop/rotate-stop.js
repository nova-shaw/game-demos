import { buildDeck }   from '../_common/modules/card-builder.js';
import { Timer }       from '../_common/modules/timer.js';
import * as choose     from '../_common/modules/choose.js';
import { easeOutQuad } from '../_common/modules/utils.js';
import * as fetcher    from '../_common/modules/fetcher.js';

const log = console.log;

///////////////////////////////////////////////////////////////
// Setup

const display = document.querySelector('#display');
// const btnPlay   = document.querySelector('#btn-play');
// const btnReset  = document.querySelector('#btn-reset');
// const btnReveal = document.querySelector('#btn-reveal');
// const rngSpeed  = document.querySelector('#rng-speed');

let lessonData;
let deck;
let cardList;

(async () => {
  lessonData = await fetcher.all(['../_lessons/kids_5b07.json']);
  deck = await buildDeck(lessonData[0], cardClick, 'stripes'); // Patterns: dots | stripes | check | zigzag
  display.appendChild(deck);
  cardList = [...deck.children];
  choose.setup(cardList.length);
})();

let timer = new Timer(
  [ { ms: 100, fn: chooseAndShow },
    { ms: 100, fn: hideAll } ],
  onStart, onPause, onCancel
);

const speed = { min: 400, max: 1200}; // DOM slider is normalised value (ie 0-1 float)


///////////////////////////////////////////////////////////////
// Card Event

function cardClick(e) {
  timer.cancel();
  deck.classList.remove('anim-stagger');

  const card = e.currentTarget;
  const shown = card.classList.toggle('show');
}


///////////////////////////////////////////////////////////////
// Timer Callbacks

function onStart() {
  // Enable play-state buttons
  document.body.classList.add('running');
}


function onPause() {
  // Keep current card shown
  if (index != null) deck.children[index].classList.add('show');

  // Enable play-state buttons
  document.body.classList.remove('running');
}


function onCancel() {
  // Remove focus style from all cards
  hideAll();

  // Disable play-state buttons
  document.body.classList.remove('running');
}


let index = null;
function chooseAndShow() {

  // index = choose.random();
  index = choose.next();
  // index = choose.nextReverse();

  // Add focus style to element at chosen index
  if (index != null) deck.children[index].classList.add('show');
}

function hideAll() {
  // Remove focus style from all cards (animation stagger is set in CSS)
  cardList.forEach( c => c.classList.remove('show') );
}


///////////////////////////////////////////////////////////////
// Control UI Events

const btnPlay = document.querySelector('#btn-play');
btnPlay.addEventListener('click', e => {
  deck.classList.remove('anim-stagger');
  timer.toggle(0);
});


const btnReset = document.querySelector('#btn-reset');
btnReset.addEventListener('click', e => {
  timer.cancel();

  // Re-run setup to clear history etc
  choose.setup(cardList.length);

  // Show all cards with time stagger
  deck.classList.add('anim-stagger');
  deck.querySelectorAll('.card').forEach( child => {
    child.classList.remove('show');
  });

  // Enable play-state buttons
  btnPlay.toggleAttribute('disabled', false);
  btnReveal.toggleAttribute('disabled', false);
});


const btnReveal = document.querySelector('#btn-reveal');
btnReveal.addEventListener('click', e => {
  timer.cancel();

  // Hide all cards with time stagger
  deck.classList.add('anim-stagger');
  deck.querySelectorAll('.card').forEach( child => {
    child.classList.add('show');
  });

  // Disable play-state buttons
  btnPlay.toggleAttribute('disabled', true);
  btnReveal.toggleAttribute('disabled', true);
})


///////////////////////////////
// Speed change

const rngSpeed = document.querySelector('#rng-speed');
rngSpeed.addEventListener('input', updateSpeedFromSlider);

function updateSpeedFromSlider() {
  const shapedValue = ((speed.max - speed.min) - easeOutQuad(rngSpeed.value) * (speed.max - speed.min)) + speed.min;
  // Update first interval only (chooseAndShow) - leave second interval (hideAll) as a constant
  timer.updateInterval(0, shapedValue);
}

updateSpeedFromSlider(); // Init value from DOM element
