
// import { uiElement } from './_common/js/ui-element.js';
import { popWindow, messageBusStart } from './_common/js/window.js';
// import * as controls from './_common/js/ui-controls.js';
// import { rateOptions, rateDefaultIndex } from './_common/js/ui-playbackrate.js';


const log = console.log;



//////////////////////////////////////////////////
// Message bus for communicating between windows. Format for SENDING:
//  messageBus.postMessage({
//     type:  'confirm' | 'display' | 'control',
//     value: [anything]
//  });
const messageBus = messageBusStart();
messageBus.addEventListener('message', (e) => {

  log('Message from Display window:', e.data);
  
  const msg = e.data;
  switch (msg.type) {
    // case 'displayIsOpen': displayIsOpen = true; break;
    // case 'displayClosed': displayIsOpen = false; break;
    case 'open': displayIsOpen = msg.value; break; // should be true|false
    // case 'update': mediaUpdate(msg); break;
    case 'media': mediaUpdate(msg); break;
  }
});

function displayState() {

}


// On first page load, check if Display window is open
let displayIsOpen = false;
checkDisplayIsOpen();

// Opens blank Display window
async function openDisplayWindow() {
  if (!displayIsOpen){
    return await popWindow('display.html', 'nto_display'); // Returns reference to popped window
    // return await popWindow('./flip-find/index.html', 'nto_display'); // Returns reference to popped window
  }
}

// Opens Display window with media, doesn't re-open if already open
async function messageDisplayWindow(message) {
  // log('messageDisplayWindow');
  // checkDisplayIsOpen();
  if (!displayIsOpen) {
    const win = await openDisplayWindow(); // Use returned window reference to wait for load
    win.onload = () => { // Only post the message once Display is loaded, otherwise it'll miss the message
      messageBus.postMessage(message);
    }
  } else { // Display already open, post message immediately
    messageBus.postMessage(message);
  }
}

function checkDisplayIsOpen() {
  log('checkDisplayIsOpen', displayIsOpen);
  // messageBus.postMessage({ key: 'displayCheck' });
  // messageBus.postMessage({ type: 'ping' });
  messageBus.postMessage({ type: 'confirm' });
}



function mediaUpdate(msg) {
  
  log('MESSAGE from Display: mediaUpdate', msg);

  if (msg.key === 'paused') {
    log('paused', msg.val);
    // controls.setSeekPosition(msg.val);
    controlElm.classList.toggle('paused', msg.val);
    // controls.classList.toggle('playing', !msg.val);
  }
  if (msg.key === 'time') {
    controls.setSeekPosition(msg.val);
  }
  if (msg.key === 'rate') {
    // controls.setSeekPosition(msg.val);
    // log('rate', msg.val);
    const rateSetting = rateOptions.find( opt => opt.rate == msg.val );
    log(rateSetting);
  }
}


//////////////////////////////////

const btnOpenDisplay = document.querySelector('#btn_open_display');
btnOpenDisplay.addEventListener('click', openDisplayWindow);


//////////////////////////////////

const bgButtons = document.querySelectorAll('.display_bg');
bgButtons.forEach( b => { b.addEventListener('click', changeDisplayBackground) });

function changeDisplayBackground(e) {
  e.preventDefault();
  const bgArray = e.currentTarget.dataset.background.split('|');
  const backgroundName   = bgArray[0] || '';
  const backgroundColor1 = bgArray[1] || '7db6e7';
  const backgroundColor2 = bgArray[2] || '79d2f2';

  messageBus.postMessage({
    type: 'background',
    value: {
      name: backgroundName,
      colors: [`#${backgroundColor1}`, `#${backgroundColor2}`]
    }
  });
}


