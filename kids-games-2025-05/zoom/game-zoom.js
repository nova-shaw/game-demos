import { lerp, easeInQuart } from '../_common/modules/utils.js';
import { uiElement } from '../_common/modules/ui-element.js';
import * as anim from '../_common/modules/anim.js';
import * as lessonData from '../_lessons/class5_bookb_07.js';

const log = console.log;

const lessonid = 'class5_bookb_07';
const mediaPath = `../_lessons/${lessonid}/`;



const display = document.querySelector('#display');
let card = null;
let face = null;
let text = null;


function buildDeck(data) {
  const deck = uiElement({ type: 'div', id: 'deck' });
  
  const cardChooser = document.querySelector('ul#card-chooser');
  data.vocab.forEach( item => {
    const cardThumb = buildCardThumb(item);
    cardChooser.appendChild(cardThumb);
  });

  card = buildCard();
  deck.appendChild(card);
  display.appendChild(deck);
}


function buildCardThumb(cardData) {
  
  const li = uiElement({ type: 'li', classes: 'card-thumb', data_attrs: { card: cardData.slug } });
  const img  = uiElement({ type: 'img', attrs: { src: `${mediaPath}${cardData.image}` } });
  const text = uiElement({ type: 'p', classes: 'text', text: cardData.text });

  li.appendChild(img);
  li.appendChild(text);

  li.addEventListener('click', chooseCard);
  
  return li;
}



function chooseCard(e) {
  const cardSlug = e.currentTarget.dataset.card;
  const cardData = lessonData.data.vocab.find( item => item.slug == cardSlug );

  const face = buildCardFace(cardData);
  const currentface = card.querySelector('.face');
  text = face.querySelector('.text');
  currentface.replaceWith(face);

  const poi = (cardData.poi) ? cardData.poi : [50, 50]; // Fallback to center if no 'Point Of Interest' found in image data
  card.style.setProperty('--poi', `${poi[0]}% ${poi[1]}%`);

  card.style.setProperty(`--zoom`, maxZoom);

  anim.reset();
}



function buildCard(cardData) {

  const card = uiElement({ type: 'div', classes: 'card' });
  const face = buildCardFace(cardData);
  card.appendChild(face);

  return card;
}

function buildCardFace(cardData = null) {

  const face = uiElement({ type: 'div', classes: 'face' });

  if (cardData) {
    const img  = uiElement({ type: 'img', attrs: { src: `${mediaPath}${cardData.image}` } });
    const text = uiElement({ type: 'p', classes: 'text', text: cardData.text });
    face.appendChild(img);
    face.appendChild(text);

  } else {
    face.classList.add('blank');
  }
  return face;
}

buildDeck(lessonData.data);





///////////////////////////////////////////////////////////////
// Actual animation

const maxZoom = 40;
const minZoom = 1;

function zoomOutSlowly(per) { // `per` is float 0-1
  const factor = easeInQuart(1 - per); // Invert the percent and ease
  const val = lerp(factor, minZoom, maxZoom);
  card.style.setProperty(`--zoom`, val);
  text?.classList.toggle('show', per > 0.98);
}



///////////////////////////////////////////////////////////////
// Animation controls UI

const animToggle = document.querySelector('#btn_playtoggle');
const animRange  = document.querySelector('#rng_playback');
const animReveal = document.querySelector('#btn_reveal');

anim.setup(animToggle, animRange, 10000, zoomOutSlowly);

animReveal.addEventListener('click', e => {
  anim.play(1000);
});



const btnCorrect = document.querySelector('#btn_correct');
const btnIncorrect = document.querySelector('#btn_incorrect');

btnCorrect.addEventListener('click', () => {
  if (document.body.dataset.result == 'correct') {
    document.body.dataset.result = '';
  } else {
    document.body.dataset.result = '';
    // document.body.dataset.result = 'correct';
    setTimeout( () => { document.body.dataset.result = 'correct'; }, 100);
  }
});

btnIncorrect.addEventListener('click', () => {
  if (document.body.dataset.result == 'incorrect') {
    document.body.dataset.result = '';
  } else {
    document.body.dataset.result = '';
    // document.body.dataset.result = 'incorrect';
    setTimeout( () => { document.body.dataset.result = 'incorrect'; }, 100);
  }
});