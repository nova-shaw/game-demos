// import { cursor, toggleCursorTextMode } from './cursor.js';
import * as cursor from './cursor.js';

// const log = console.log;

const presetKeys = { //// Always used
  'Escape': cursor.toggleCursorTextMode,
}

let pageKeys = {}; //// Set by page

export function addKeys(array) {
  pageKeys = array;
}


window.addEventListener('keydown', (e) => {

  // log(e.code);

  // Always trigger preset key actions first
  const presetKey = presetKeys[e.code];
  if (presetKey) presetKey();

  // Ignore subsequent key presses if cursor is in text mode
  if (cursor.cursorElm.classList.contains('text-mode')) return;

  // Optionally trigger page-defined key actions
  const addedKey = pageKeys[e.code];
  if (addedKey) addedKey();
});
