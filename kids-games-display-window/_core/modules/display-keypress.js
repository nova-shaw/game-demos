
import * as cursor from './display-cursor.js';

const presetKeys = { //// Always used
  'Escape': cursor.toggleCursorTextMode,
}

let pageKeys = {}; //// Set by page

export function addKeys(array) {
  pageKeys = array;
}


window.addEventListener('keydown', (e) => {
  // console.log(e.code);

  // Always trigger preset key actions first
  const presetKey = presetKeys[e.code];
  if (presetKey) presetKey();

  // Ignore subsequent key presses if cursor is in text mode
  if (document.body.classList.contains('cursor-text-mode')) return;

  // Optionally trigger page-defined key actions
  const addedKey = pageKeys[e.code];
  if (addedKey) addedKey();
});
