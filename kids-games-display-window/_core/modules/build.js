/**
* Convenience function for creating DOM elements
* Usage:
* elm({ type: 'button', attrs: { key: 'value' } })
*/

export function elm({ // These are 'simulated' named paramers (with defaults) - https://exploringjs.com/js/book/ch_callables.html#simulating-named-parameters
  type       = 'div',
  href       = null,
  id         = null,
  classes    = null,
  attrs      = null,
  data_attrs = null,
  text       = null,
  html       = null } = {})
{

  const element = document.createElement(type);

  if (href) {
    element.href = href;
  }

  if (id) {
    element.setAttribute('id', id);
  }
  
  if (classes) {
    element.classList = classes;
  }

  if (attrs) {
    for (const key in attrs) {
      element.setAttribute(key, attrs[key]);
    }
  }

  if (data_attrs) {
    for (const key in data_attrs) {
      element.setAttribute(`data-${key}`, data_attrs[key]);
    }
  }

  if (text) {
    element.textContent = text;
  }

  if (html) { //// This is dangerous to provide, but allows basic formatting such as <b> and <i> to be kept in the JSON
    element.innerHTML = html;
  }

  return element;
}


export function card({
    content = { items: [], mediapath: '' },
    flippable = false,
    draggable = false
  } = {}) {

  const card  = elm({ type: 'div', classes: 'card' });
  const sides = elm({ type: 'div', classes: 'sides' });
  const face  = elm({ type: 'div', classes: 'face' });
  
  content.items.forEach( item => {
    const group = elm({ type: 'div', classes: 'group' });
    const image = elm({ type: 'img', attrs: { 'src': `${content.mediapath}${item.image}` } });
    const text  = elm({ type: 'p',   classes: 'html', text: item.text });
    group.appendChild(image);
    group.appendChild(text);
    face.appendChild(group);
  });

  sides.appendChild(face);

  if (flippable) {
    const back = elm({ type: 'div', classes: 'back' });
    // const pattern = elm({ type: 'div', classes: `pattern ${cssBackPattern}` });
    const pattern = elm({ type: 'div', classes: `pattern` });
    back.appendChild(pattern);
    sides.appendChild(back);
  }

  card.appendChild(sides);

  return card;
}