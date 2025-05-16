/**
* Convenience function for creating DOM elements
* Usage:
* uiElement({ type: 'button', attrs: { key: 'value' } })
*/

export function uiElement({ // These are 'simulated' named paramers (with defaults) - https://exploringjs.com/js/book/ch_callables.html#simulating-named-parameters
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

