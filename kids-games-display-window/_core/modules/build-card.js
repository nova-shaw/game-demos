
import { uiElement } from './ui-element.js';

export function card({
    content = { items: [], mediapath: '' },
    flippable = false,
    draggable = false
  } = {}) {

  const card  = uiElement({ type: 'div', classes: 'card' });
  const sides = uiElement({ type: 'div', classes: 'sides' });
  const face  = uiElement({ type: 'div', classes: 'face' });
  
  content.items.forEach( item => {
    const group = uiElement({ type: 'div', classes: 'group' });
    const image = uiElement({ type: 'img', attrs: { 'src': `${content.mediapath}${item.image}` } });
    const text  = uiElement({ type: 'p',   classes: 'html', text: item.text });
    group.appendChild(image);
    group.appendChild(text);
    face.appendChild(group);
  });

  sides.appendChild(face);

  if (flippable) {
    const back = uiElement({ type: 'div', classes: 'back' });
    // const pattern = uiElement({ type: 'div', classes: `pattern ${cssBackPattern}` });
    const pattern = uiElement({ type: 'div', classes: `pattern` });
    back.appendChild(pattern);
    sides.appendChild(back);
  }

  card.appendChild(sides);

  return card;
}


