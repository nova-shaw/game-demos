
import { popWindow, messageBusStart } from './_core/modules/window.js';
import * as win from './_core/modules/window.js';

import * as fetcher from  './_core/modules/build-fetcher.js';

import * as build from   './_core/modules/build.js';

const log = console.log;

let displayIsOpen = false;
let displayWindowRef = null; // Only useful as long as this (parent) page isn't refreshed after popup triggered (reference is lost if parent is refreshed)




const p = await fetcher.all([
  '_data/kids-phonics-single.json',
  '_data/kids-5b07.json'
]);
log(p[1]);

let prevLesson;
const currentLesson = p[1];
if (currentLesson.meta.number > 1) {
  log('review!');
  prevLesson = await fetcher.all([`_data/kids-5b${String(currentLesson.meta.number - 1).padStart(2, '0')}.json`]);
  log(prevLesson);
}

// const p0 = p[0];

// log(Object.entries(p[0]));


/*p.forEach( set => {
  log(set);
  set.forEach( letter => {
    log(letter)
  });
});*/

const phonicsList = build.elm({ type: 'div', id: 'phonicslist' });

for (const setID in p[0]) {
  const setGroup = build.elm({ type: 'div', id: `set-${setID}`, classes: 'group' });
  const setTitle = build.elm({ type: 'h3', text: `Set ${setID.toUpperCase()}` });
  setGroup.appendChild(setTitle);

  const setList = build.elm({ type: 'ul' });

  // log(setID);
  p[0][setID].forEach( letter => {
    // log(setID, letter);
    const li   = build.elm({ type: 'li' });
    // const link = build.elm({ type: 'a', text: letter.word, href: `phonics-set${setID}-${letter.letter}` });
    const link = build.elm({ type: 'a',
      href: `phonics-set${setID}-${letter.letter}`,
      data_attrs: {
        'set': setID,
        'letter': letter.letter,
        'file': letter.file,
        'word': letter.word
      }
    });
    const txt  = build.txt( letter.word );
    const img  = build.elm({ type: 'img', attrs: { 'src': `../../../MM-dev-MEDIA/kids-phonics/phonics-set${setID}/${letter.file}` } });

    link.addEventListener('click', e => {
      e.preventDefault();
      const data = {
        set: e.currentTarget.dataset.set,
        file: e.currentTarget.dataset.file,
        // text: `${e.currentTarget.dataset.letter.toUpperCase()} ${e.currentTarget.dataset.letter}`
        text: e.currentTarget.dataset.word
      }
      messageBus.postMessage({ type: 'phonicscard', value: data });
    });

    link.appendChild(img);
    link.appendChild(txt);
    li.appendChild(link);
    setList.appendChild(li);
  });

  setGroup.appendChild(setList);
  phonicsList.appendChild(setGroup);
}

document.body.appendChild(phonicsList);

/*for (const [key, value] of Object.entries(p0)) {
  log(`${key}: ${p0.value}`);
  // log(`${key}: ${p[0].value}`);
  // log(`${p[0].key}: ${p[0].value}`);
  p0[key].forEach( letter => {
    log(key, letter);
  })
}*/




//////////////////////////////////////////////////
// Message bus for communicating between windows. Format for SENDING:
//  messageBus.postMessage({
//     type:  'confirm' | 'display' | 'control',
//     value: [anything]
//  });
const messageBus = win.messageBusStart();
messageBus.addEventListener('message', messageBusReceive);

function messageBusReceive(event) {
  const msg = event.data;
  log('Message from Display window:', msg);
  
  switch (msg.type) {
    // case 'displayIsOpen': displayIsOpen = true; break;
    // case 'displayClosed': displayIsOpen = false; break;
    case 'isopen': displayConfirmed(msg); break;
    // case 'update': mediaUpdate(msg); break;
    case 'media': mediaUpdate(msg); break;
  }
}

function displayConfirmed(msg) {
  // log('displayConfirmed', msg);
  displayIsOpen = msg.value; // should be true|false
  document.body.dataset.display = (displayIsOpen) ? 'open' : 'closed';
  // document.body.classList.toggle('display-is-open', displayIsOpen);
}



// Opens blank Display window
async function openDisplayWindow() {
  if (!displayIsOpen){
    displayWindowRef = await win.popWindow('display.html', 'nto_display'); // Returns reference to popped window
    return;
  }
  log('displayWindowRef', displayWindowRef);
}

// Opens Display window with media, doesn't re-open if already open
async function messageDisplayWindow(message) {
  // log('messageDisplayWindow');
  if (!displayIsOpen) {
    await openDisplayWindow(); // Use returned window reference to wait for load
    displayWindowRef.onload = () => { // Only post the message once Display is loaded, otherwise it'll miss the message
      messageBus.postMessage(message);
    }
  } else { // Display already open, post message immediately
    messageBus.postMessage(message);
  }
}

// On first page load, check if Display window is open

function requestDisplayOpenConfirmation() {
  messageBus.postMessage({ type: 'confirm' });
}
requestDisplayOpenConfirmation();



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

const btnOpenDisplay = document.querySelector('#btn-open-display');
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
    type: 'bground',
    value: {
      name: backgroundName,
      colors: [`#${backgroundColor1}`, `#${backgroundColor2}`]
    }
  });
}







const showCard = document.querySelector('#show-card');
showCard.addEventListener('click', e => {
  messageBus.postMessage({
    type: 'display',
    value: [ 'a card!!!' ]
  })
});
