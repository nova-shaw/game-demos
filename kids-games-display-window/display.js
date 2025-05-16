
import { uiElement } from './_core/modules/build-uielement.js';
import * as win from      './_core/modules/window.js';
import * as cursor from   './_core/modules/display-cursor.js';
import * as keypress from './_core/modules/display-keypress.js';
import * as build from   './_core/modules/display-builder.js';

const log = console.log, dir = console.dir;


//////////////////////////////////////////////////
// Settings

let globalVolume = 1;
let rippleTime = 1000;
document.body.style.setProperty('--rippletime', `${rippleTime}ms`);




//////////////////////////////////////////////////
// Page elements

const main = document.querySelector('main');
const patternDisplay = document.querySelector('#pattern-display');

const imageFrame = document.querySelector('#image-frame');
const audioFrame = document.querySelector('#audio-frame');
const videoFrame = document.querySelector('#video-frame');
const buildFrame = document.querySelector('#build-frame');

const imagePath = '../display-window-content-not-synced/media/image/';
const audioPath = '../display-window-content-not-synced/media/audio/';
const videoPath = '../display-window-content-not-synced/media/video/';


//////////////////////////////////////////////////
// Temp

const c1 = build.card({
  content: {
    items: [
      { "text": "art",     "slug": "art",     "poi": [37, 45], "image": "art.svg" },
      // { "text": "English", "slug": "english", "poi": [42, 34], "image": "english.svg" },
      // { "text": "math",    "slug": "math",    "poi": [68, 20], "image": "math.svg" },
      // { "text": "music",   "slug": "music",   "poi": [17, 66], "image": "music.svg" },
      // { "text": "science", "slug": "science", "poi": [20, 59], "image": "science.svg" }
    ],
    mediapath: '_data/c5b-07/'
  },
  flippable: false
});

const c2 = build.card({
  content: {
    items: [
      // { "text": "art",     "slug": "art",     "poi": [37, 45], "image": "art.svg" },
      // { "text": "English", "slug": "english", "poi": [42, 34], "image": "english.svg" },
      { "text": "math",    "slug": "math",    "poi": [68, 20], "image": "math.svg" },
      // { "text": "music",   "slug": "music",   "poi": [17, 66], "image": "music.svg" },
      // { "text": "science", "slug": "science", "poi": [20, 59], "image": "science.svg" }
    ],
    mediapath: '_data/c5b-07/'
  },
  flippable: true
});

buildFrame.appendChild(c1);
buildFrame.appendChild(c2);



//////////////////////////////////////////////////
// Saving window coordinates

window.addEventListener('beforeunload', () => {
  log('unload');
  win.saveWindowCoords('nto_display');
  messageBus.postMessage({ type: 'isopen', value: false });
  messageBus.postMessage({ type: 'active', value: activeNodes });
});


//////////////////////////////////////////////////
// Custom Cursor events

window.addEventListener('pointermove',   cursor.pointerMove);
window.addEventListener('pointerover',   cursor.pointerIn);
window.addEventListener('pointerout',    cursor.pointerOut);
window.addEventListener('pointercancel', cursor.pointerOut);


//////////////////////////////////////////////////
// Keypress events

keypress.addKeys({
  'KeyC': cursor.cycleCursorImage,
  'KeyV': cursor.cycleCursorColor,
  'KeyM': cursor.mirrorCursor,
  'KeyE': cursor.largeCursor
});


//////////////////////////////////////////////////
// Message bus for communicating between windows

const messageBus = win.messageBusStart();
messageBus.addEventListener('message', messageBusReceive);

function messageBusReceive(event) {
  const msg = event.data;
  log('Message received from Parent window:', msg);

  switch (msg.type) { // Only 3 types of incoming msg from Resource window
    case 'confirm': confirmDisplayOpen(); break;
    case 'display': displayMedia(msg.value); break;
    case 'bground': changeBackground(msg.value); break;
    case 'control': controlDispatch(msg.value); break;
  }
}



//////////////////////////////////////////////////
// Tell parent (Resource) window that Display is open

function confirmDisplayOpen() {
  messageBus.postMessage({ type: 'isopen', value: true });
  // log(window);
  // messageBus.postMessage({ type: 'open', value: window.name });
}
confirmDisplayOpen(); // Call on page load


//////////////////////////////////////////////////
// Incoming media control messages

function controlDispatch(msg) {
  switch (msg.event) {
    case 'play_toggle': playToggle(); break;
    
    case 'seek_start':  seekStart(); break;
    case 'seek_move':   seekPercent(Number(msg.value)); break;
    case 'seek_end':    seekEnd(); break;
    
    case 'rate_change': speedChange(Number(msg.value)); break;
    case 'rate_reset':  speedReset(); break;
    
    case 'volume_change': volumeChange(Number(msg.value)); break;
    case 'mute_toggle':   muteToggle(); break;
  }
}


//////////////////////////////////////////////////
// Track current active display element

// Store the current active media node here so control messages can reach it
let active = {
  types: [],
  // nodes: [],
  playable: null
}

let activeNodes = []; // all active display nodes (can be multiple, eg image and audio)
let activeTypes = []; // all active types as array of strings
let activePlayer = null; // active playable node (can only be one)


function displayMedia(msg) {

  log('displayMedia', msg);

  document.body.classList.add('loading');

  for (const node of activeNodes) {
    const type = node.dataset.type;
    if (type == 'video' || type == 'audio') node.pause();
    node.src = '';
  }

  activeNodes = [];
  activeTypes = [];

  // Multiple types are needed so iterate through all, loading each
  for (const [type, value] of Object.entries(msg)) {

    log('type/value', type, value);

    switch (type) {
      case 'image': loadImage(value);   break;
      case 'audio': loadAudio(value);   break;
      case 'video': loadVideo(value);   break;
      case 'layout': buildLayout(value); break;
      // case 'background': changeBackground(value); break;
      // default: log('TYPE: everything else', type); break;
    }

    // const node = media[type].node;
    // node.src = `${media[type].path}${value}`;

    activeTypes.push(type);
    // active.nodes.push(node);
    // if (type == 'video' || type == 'audio') active.playable = node;
  }

  // Set CSS on body element to control what's visible
  document.body.dataset.display = activeTypes.sort().join('+');
}


///////////////////////////////
// Loading elements

function loadImage(data) {
  activePlayer = null;
  activeNodes.push(imageFrame);
  imageFrame.src = `${imagePath}${data.file}`;
}

function loadAudio(data) {
  activePlayer = audioFrame;
  activeNodes.push(audioFrame);
  audioFrame.src = `${audioPath}${data.file}`;
  audioFrame.volume = globalVolume;
}

function loadVideo(data) {
  activePlayer = videoFrame;
  activeNodes.push(videoFrame);
  videoFrame.src = `${videoPath}${data.file}`;
  audioFrame.volume = globalVolume;
}

function buildLayout(data) {
  activeNodes.push(buildFrame);
  log('buildLayout', data);
}


///////////////////////////////
// Unloading elements







function changeBackground(data) {
  log('changeBackground', data);
  document.body.dataset.background = data.name;
  if (data.name != '') patternDisplay.setAttribute('fill', `url(#pattern-${data.name})`);
  if (data.colors[0] != '') document.body.style.setProperty('--pattern-color1', data.colors[0]);
  if (data.colors[1] != '') document.body.style.setProperty('--pattern-color2', data.colors[1]);
}




//////////////////////////////////////////////////
// Track current active display element

function playToggle() {
  if (activePlayer.paused || activePlayer.ended) {
    activePlayer.play();
  } else {
    activePlayer.pause();
  }
}

let isSeeking = false;
let resumeAfterSeek = false;

function seekStart() {
  isSeeking = true;
  resumeAfterSeek = !activePlayer.paused;
  activePlayer.pause();
}

function seekEnd() {
  isSeeking = false;
  if (resumeAfterSeek) activePlayer.play();
}

function seekPercent(percent) {
  activePlayer.currentTime = activePlayer.duration * percent;
}

function speedChange(value) {
  // log('speedChange', value);
  activePlayer.playbackRate = value;
}

function speedReset() {
  activePlayer.playbackRate = 1
}

function muteToggle() {
  activePlayer.muted = !activePlayer.muted;
}

function volumeChange(per) {
  globalVolume = per;
  activePlayer.volume = globalVolume;
}




//////////////////////////////////////////////////
// Outgoing media event messages

imageFrame.addEventListener('load', mediaLoaded);

videoFrame.addEventListener('canplaythrough', mediaLoaded);
videoFrame.addEventListener('emptied',        mediaEmptied);
videoFrame.addEventListener('play',           mediaPlayToggle);
videoFrame.addEventListener('pause',          mediaPlayToggle);
videoFrame.addEventListener('timeupdate',     mediaTimeUpdate);
videoFrame.addEventListener('volumechange',   mediaVolumeChange);
videoFrame.addEventListener('mute',           mediaMuteToggle);
videoFrame.addEventListener('unmute',         mediaMuteToggle);
videoFrame.addEventListener('ratechange',     mediaRateChange);

audioFrame.addEventListener('canplaythrough', mediaLoaded);
audioFrame.addEventListener('emptied',        mediaEmptied);
audioFrame.addEventListener('play',           mediaPlayToggle);
audioFrame.addEventListener('pause',          mediaPlayToggle);
audioFrame.addEventListener('timeupdate',     mediaTimeUpdate);
audioFrame.addEventListener('volumechange',   mediaVolumeChange);
audioFrame.addEventListener('mute',           mediaMuteToggle);
audioFrame.addEventListener('unmute',         mediaMuteToggle);
audioFrame.addEventListener('ratechange',     mediaRateChange);

/*
//// Maybe later: show the amount of video buffered in seek slider
//// Thanks: https://stackoverflow.com/a/5182578
media.video.node.addEventListener('progress', function() {
  var range = 0;
  var bf = this.buffered;
  var time = this.currentTime;

  log(bf);

  while(!(bf.start(range) <= time && time <= bf.end(range))) {
      range += 1;
  }
  var loadStartPercentage = bf.start(range) / this.duration;
  var loadEndPercentage = bf.end(range) / this.duration;
  var loadPercentage = loadEndPercentage - loadStartPercentage;
  
  log(loadPercentage);
});
*/

// audioFrame.addEventListener('ended', () => { audioBars.classList.add('rest') });


function mediaLoaded() {
  // log('mediaLoaded');
  document.body.classList.remove('loading');
  // viewerBus.postMessage({ type: 'media', key:'loaded', val: active.type });
  messageBus.postMessage({ type: 'media', key:'loaded', val: active.type });
}

function mediaEmptied() {
  // viewerBus.postMessage({ type: 'media', key:'emptied', val: active.type });
  messageBus.postMessage({ type: 'media', key:'emptied', val: active.type });
}


function mediaVolumeChange() {
  log('volume changed', active.node.volume);
  // viewerBus.postMessage({ type: 'media', key:'volume', val: active.node.volume, muted: active.node.muted });
  messageBus.postMessage({ type: 'media', key: 'volume', val: activePlayer.volume });
  // messageBus.postMessage({ type: 'media', key: 'muted', val: activePlayer.muted });
}

function mediaPlayToggle() {
  if (isSeeking) return; // Don't send the message if seeking
  // viewerBus.postMessage({ type: 'media', key:'paused', val: active.node.paused });
  // messageBus.postMessage({ type: 'media', val: { type: 'paused', val: active.node.paused } });
  messageBus.postMessage({ type: 'media', key: 'paused', val: activePlayer.paused });
}

function mediaTimeUpdate() {
  
  log('isSeeking', isSeeking);

  if (isSeeking) return;
  if (!activePlayer) return;

  //// `duration` is often NaN before load completes
  const per = (!isNaN(activePlayer.currentTime) && !isNaN(activePlayer.duration)) ?
    activePlayer.currentTime / activePlayer.duration :
    0;
  // viewerBus.postMessage({ type: 'media', key:'timeupdate', val: per });
  messageBus.postMessage({ type: 'media', key: 'time', val: per });
}

function mediaMuteToggle() {
  log('mute toggled', activePlayer.muted);
  // viewerBus.postMessage({ type: 'media', key:'muted', val: active.node.muted });
  messageBus.postMessage({ type: 'media', key:'muted', val: activePlayer.muted });
}

function mediaRateChange(e) {
  messageBus.postMessage({ type: 'media', key: 'rate', val: activePlayer.playbackRate });
}



//////////////////////////////////////////////////
// Catches clicks

const clickCatcher = document.querySelector('#clickcatcher');
clickCatcher.addEventListener('clickeeeee', e => {
  /*const coords = {
    px:  { x: e.pageX, y: e.pageY },
    per: { x: Math.round(e.pageX / window.innerWidth * 100), y: Math.round(e.pageY / window.innerHeight * 100) }
  }*/
  // log(e.pageX, e.pageY);
  // log(coords.px, coords.per);
  // showClick(coords.per);
  showClick({ x: e.pageX, y: e.pageY });
});
clickCatcher.addEventListener('pointerdown', e => {
  showClick({ x: e.pageX, y: e.pageY });
});

function showClick(coords) {
  const ripple = uiElement({ type: 'div', classes: 'ripple' });
  // ripple.style = `left: ${coords.x}%; top: ${coords.y}%`;
  ripple.style = `left: ${coords.x}px; top: ${coords.y}px`;
  clickCatcher.appendChild(ripple);
  setTimeout( () => { ripple.remove() }, 1000);
}


//////////////////////////////////////////////////
// Frameguide
// An indication of how close the current window size is
// to best proportions for most media (set in CSS)

let resizeTimer;
window.addEventListener('resize', () => {
  
  // Show frameguide immediately when window is resized  
  document.body.classList.add('show-aspect-guide');
  clearTimeout(resizeTimer);

  // Hide frameguide after 1 second of window not being resized
  resizeTimer = setTimeout( () => {
    document.body.classList.remove('show-aspect-guide');
  }, 1000);
});