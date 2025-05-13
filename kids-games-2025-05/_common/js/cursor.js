
export const cursorElm = document.querySelector('#cursor');
export const cursorText = document.querySelector('#cursor-text');
export const cursorImage = cursor.querySelector('#cursor-svg-use');

const log = console.log;


/**
 * Basics for moving the custom cursor
 * */

export function pointerIn(e) {
  pointerMove(e);
  document.body.classList.add('show-cursor');
}

export function pointerOut() {
  document.body.classList.remove('show-cursor');
}

export function pointerMove(e) {
  if (!e.isPrimary) return; // Ignore extra pointers when on multi-touch device
  document.body.classList.add('show-cursor');
  cursor.style.translate = `${e.pageX}px ${e.pageY}px`;
}


/**
 * Changing the cursor image
 * */

// Automatically build the list of all cursor images from in-page SVG
/*const cursorNodes = document.querySelectorAll('svg#defs defs g[id^="cursor-"]');
const cursorList = [...cursorNodes].map( node => node.id );*/

// Cursors have been moved out of display.html into assets/cursors.svg
// So the list must be built manually (unless we find a way to load and read the SVG file to count them)

const cursorList = [
  'cursor-default',
  'cursor-pencil',
  'cursor-smile'
]

let cursorImageIndex = 0;

export function cycleCursorImage() {
  cursorImageIndex = (cursorImageIndex >= cursorList.length-1) ? 0 : ++cursorImageIndex;
  // log(cursorImageIndex, cursorList[cursorImageIndex]);
  // cursorImage.setAttribute('xlink:href', `#${cursorList[cursorImageIndex]}`);
  cursorImage.setAttribute('href', `./_common/assets/cursors.svg#${cursorList[cursorImageIndex]}`);
}


/**
 * Effects for the cursor
 * */

export function mirrorCursor() { // flips cursor along vertical axis
  cursor.classList.toggle('mirror');
}

export function largeCursor() { // flips cursor along vertical axis
  cursor.classList.toggle('large');
}


/**
 * Cursor color change
 * */

const cursorColors = ['#000', '#f00', '#60c5ff', '#be80ff', 'yellow', '#40ff40'];
let cursorColorIndex = 0;

export function cycleCursorColor() {
  cursorColorIndex = (cursorColorIndex >= cursorColors.length-1) ? 0 : ++cursorColorIndex;
  cursorImage.style.color = cursorColors[cursorColorIndex];
}


/**
 * Toggle cursor text mode
 * */

export function toggleCursorTextMode() {
  cursor.classList.toggle('text-mode');
  cursorText.focus();
}


// This solves the 'mouse/pointer click resets typing caret position' bug
// but also means all mouse/pointer clicks are ignored while in typing mode

cursorText.addEventListener('click', captureClick, true);
cursorText.addEventListener('mousedown', captureClick, true);
cursorText.addEventListener('pointerdown', captureClick, true);
function captureClick(e) {
  e.preventDefault();
}