import { uiElement } from './ui-element.js';

const log = console.log;




export function buildDeck(data, clickCallback, cssBackPattern = 'dots') {
  const deck = uiElement({ type: 'div', id: 'deck' });
  const mediaPath = data.meta.mediapath;

  data.vocab.forEach( (item, index) => {
    const card = buildCard(item, index, mediaPath, cssBackPattern);
    card.addEventListener('click', clickCallback);
    deck.appendChild(card);
  });

  return deck;
}



export function buildCard(cardData, index, mediaPath, cssBackPattern) {

  const card  = uiElement({ type: 'div', classes: 'card',
    attrs: { 'style': `--anim-delay:${index}` }, // Thanks for the CSS-only stagger idea: https://stackoverflow.com/a/70476658
    data_attrs: { 'index': index }
  });

  const sides = uiElement({ type: 'div', classes: 'sides' });
  const back  = uiElement({ type: 'div', classes: 'back' });
  const face  = uiElement({ type: 'div', classes: 'face' });
  
  const image = uiElement({ type: 'img', attrs: { 'src': `../${mediaPath}${cardData.image}` } });
  const text  = uiElement({ type: 'p',   classes: 'text', text: cardData.text });
  face.appendChild(image);
  face.appendChild(text);

  const pattern = uiElement({ type: 'div', classes: `pattern ${cssBackPattern}` });
  back.appendChild(pattern);

  sides.appendChild(face);
  sides.appendChild(back);
  card.appendChild(sides);


  return card;
}

export function buildCompCard(imgArray) {

}