import { buildDeck }   from '../_common/modules/card-builder.js';
import { Timer }       from '../_common/modules/timer.js';
import * as choose     from '../_common/modules/choose.js';
import { easeOutQuad } from '../_common/modules/utils.js';
import * as fetcher    from '../_common/modules/fetcher.js';

const log = console.log;

///////////////////////////////////////////////////////////////
// Setup

const display = document.querySelector('#display');





let lessonData;
let deck;
let cardList;

(async () => {
  lessonData = await fetcher.all(['../_lessons/kids_5b07.json']);
  deck = await buildDeck(lessonData[0], cardClick, 'check'); // Patterns: dots | stripes | check | zigzag
  display.appendChild(deck);
  cardList = [...deck.children];
  choose.setup(cardList.length);
})();

let timer = new Timer(
  [{ ms: 100, fn: chooseNext }],
  onStart, onPause, onCancel
);

const speed = { min: 80, max: 1000}; // DOM slider is normalised value (ie 0-1 float)


///////////////////////////////////////////////////////////////
// Card Event

function cardClick(e) {
  timer.cancel();
  deck.classList.remove('anim-stagger');

  const card = e.currentTarget;
  const shown = card.classList.toggle('show');

  const cardIndex = Number(card.dataset.index);
  let indexArray;
  if (shown) {
    indexArray = choose.removeIndex(cardIndex);
  } else {
    indexArray = choose.addIndex(cardIndex);
  }
  // log(indexArray);
  if (indexArray.length == 0) {
    btnPlay.toggleAttribute('disabled', true);
    btnReveal.toggleAttribute('disabled', true);
  } else {
    btnPlay.toggleAttribute('disabled', false);
    btnReveal.toggleAttribute('disabled', false);
  }
}


///////////////////////////////////////////////////////////////
// Timer Callbacks

function onStart() {
  chooseNext();

  // Enable play-state buttons
  document.body.classList.add('running');
  btnCancel.toggleAttribute('disabled', false);
}


function onPause() {
  // Indicate the current card is chosen, animate out
  if (index != null) deck.children[index].classList.add('show');

  // Remove this card's index from list of possibilities
  const indexArray = choose.removeIndex(index);

  // Enable play-state buttons
  document.body.classList.remove('running');
  btnCancel.toggleAttribute('disabled', true);
  
  // If no more options, disable other buttons
  if (indexArray.length == 0) {
    btnPlay.toggleAttribute('disabled', true);
    btnReveal.toggleAttribute('disabled', true);
  }
}


function onCancel() {
  // Remove focus style without choosing
  if (index != null) deck.children[index].classList.remove('focus');

  // Disable play-state buttons
  document.body.classList.remove('running');
  btnCancel.toggleAttribute('disabled', true);
}


let index = null;
function chooseNext() { 
  // Remove focus from last focused card
  if (index != null) deck.children[index].classList.remove('focus');

  // index = choose.random();
  index = choose.next();
  // index = choose.nextReverse();

  // Add focus style to element at chosen index
  if (index != null) deck.children[index].classList.add('focus');
}



///////////////////////////////////////////////////////////////
// Control UI Events

const btnPlay = document.querySelector('#btn-play');
btnPlay.addEventListener('click', e => {
  deck.classList.remove('anim-stagger');
  timer.toggle();
});


const btnCancel = document.querySelector('#btn-cancel');
btnCancel.addEventListener('click', e => {
  deck.classList.remove('anim-stagger');
  timer.cancel();
});


const btnReset = document.querySelector('#btn-reset');
btnReset.addEventListener('click', e => {
  timer.cancel();

  // Re-run setup to clear history etc
  choose.setup(cardList.length);

  // Show all cards with time stagger
  log(deck);
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
  timer.updateInterval(0, shapedValue);
}

updateSpeedFromSlider(); // Init value from DOM element

