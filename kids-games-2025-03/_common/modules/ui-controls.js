// import { createElement } from './create-element.js';
import { uiElement } from './ui-element.js';
import { createSVG } from './create-svg.js';

const log = console.log;

//// Slightly elaborate way to show playback speed: rather than just show the real number in the UI,
//// we need a way to specify each value (non-linearly) and its corresponding label to be shown in the UI
const speedOptions = [
  { speed: 0.5,  label: '-2' },
  { speed: 0.75, label: '-1' },
  { speed: 1,    label: '1x' },
  { speed: 1.25, label: '+1' },
  { speed: 1.5,  label: '+2' }
];
//// This ensures that if we change the index of the `speed: 1` entry in the array, it'll always be found
const speedDefaultIndex = speedOptions.findIndex( el => el.speed === 1 );


export function createMediaControls({ media = null, audio = false, speed = false } = {}) {
  
  const controls = createElement({ type: 'div', classes: 'controls paused' });


  //// Create UI elements, attach UI events that update media, append to `controls`

  const playButton = createPlayButton();
  playButton.addEventListener('click', () => { mediaPlayToggle(media, controls) });
  controls.appendChild(playButton);

  const seekSlider = createSeekSlider();
  seekSlider.addEventListener('pointerdown', () => { mediaSeekStart(media, controls) });
  seekSlider.addEventListener('input',        e => { mediaSeekMove(e, media) });
  seekSlider.addEventListener('pointerup',   () => { mediaSeekEnd(media, controls) });
  controls.appendChild(seekSlider);

  if (speed) {
    const speedSlider = createSpeedSlider();
    const textDisplay = createElement({ type: 'div', classes: 'text-speed' });
    textDisplay.textContent = speedOptions[speedDefaultIndex].label;
    
    speedSlider.addEventListener('input', e => { mediaSpeedChange(e, media, textDisplay) });
    textDisplay.addEventListener('dblclick', () => { mediaSpeedReset(media, speedSlider, textDisplay) });

    const group = createControlPopupGroup(textDisplay, speedSlider, 'speed');
    group.setAttribute('title', 'Playback Speed');
    controls.appendChild(group);
  }

  if (audio) {
    const volumeSlider = createVolumeSlider();
    const muteButton = createMuteButton();

    volumeSlider.addEventListener('input', e => { mediaVolumeChange(e, media) });
    muteButton.addEventListener('click', () => { mediaMuteToggle(media, controls) });
    
    const group = createControlPopupGroup(muteButton, volumeSlider, 'volume');
    controls.appendChild(group);
  }

  //// Attach media events that update UI
  media.addEventListener('timeupdate', () => { mediaTimeUpdate(media, seekSlider) });
  media.addEventListener('ended',      () => { mediaEnded(controls) });
  // media.addEventListener('play',  () => { controls.classList.remove('paused') });
  // media.addEventListener('pause', () => { controls.classList.add('paused') });
  media.addEventListener('click', () => { mediaPlayToggle(media, controls) });

  return controls;
}


////////////////////////////////////////////////////////////
// Events

// Events: UI updates media

function mediaPlayToggle(media, controls) {
  if (media.paused || media.ended) {
    media.play();
  } else {
    media.pause();
  }
  controls.classList.toggle('paused', media.paused);
}

function mediaSeekStart(media, controls) {
  controls.dataset.waspaused = media.paused; //// store playing state in document in data attribute
  media.pause();
}

function mediaSeekMove(e, media) {
  media.currentTime = media.duration * Number(e.currentTarget.value);
}

function mediaSeekEnd(media, controls) {
  if (controls.dataset.waspaused == 'false') media.play(); //// restore playing state from data attribute
  controls.removeAttribute('data-waspaused'); //// clear that attribute now its not needed
}

function mediaMuteToggle(media, controls) {
  media.muted = !media.muted;
  controls.classList.toggle('muted', media.muted);
}

function mediaVolumeChange(e, media) {
  media.volume = Number(e.currentTarget.value);
}

function mediaSpeedChange(e, media, text) {
  // media.playbackRate = Number(e.currentTarget.value);
  // text.textContent = media.playbackRate;
  const option = speedOptions[Number(e.currentTarget.value)];
  media.playbackRate = option.speed;
  text.textContent = option.label;
}

function mediaSpeedReset(media, slider, text) {
  // const optionIndex = speedOptions.findIndex( el => el.speed === 1 );
  // log(option);
  media.playbackRate = 1;
  slider.value = speedDefaultIndex;
  text.textContent = speedOptions[speedDefaultIndex].label;
}

// Events: Media updates UI

function mediaTimeUpdate(media, seek) {
  seek.value = media.currentTime / media.duration;
}

function mediaEnded(controls) {
  controls.classList.add('paused');
}



////////////////////////////////////////////////////////////
// Create control elements

function createControlPopupGroup(displayContent, popupContent, groupClass) {
  const group   = createElement({ type: 'div', classes: `group group-${groupClass}` });
  const display = createElement({ type: 'div', classes: 'display' });
  const popup   = createElement({ type: 'div', classes: 'popup' });
  display.appendChild(displayContent);
  popup.appendChild(popupContent);
  group.appendChild(display);
  group.appendChild(popup);
  return group;
}


function createPlayButton() {
  const button = createElement({
    type: 'button',
    classes: 'play',
    attrs: {
      'title': 'Play/Pause',
      'tabindex': -1
    }
  });
  button.appendChild( createSVG('icon_play') );
  button.appendChild( createSVG('icon_pause') );
  return button;
}

function createSeekSlider() {
  return createElement({
    type: 'input',
    classes: 'slider timeline',
    attrs: {
      'type': 'range',
      'name': 'timeline',
      'title': 'Seek',
      'min': 0, 'max': 1, 'step': 0.01, //// Range total 0-1 for simple lerping
      'value': 0,
      'tabindex': -1
    }
  });
}

/*function volumeGroup() {
  const group = createElement({ type: 'div', classes: 'group-vol' });
  group.appendChild( createMuteButton() );
  group.appendChild( createVolumeSlider() );
  return group;
}*/

function createMuteButton() {
  const button = createElement({
    type: 'button',
    classes: 'mute',
    attrs: {
      'title': 'Mute',
      'tabindex': -1
    }
  });
  button.appendChild( createSVG('icon_audio_on') );
  button.appendChild( createSVG('icon_audio_off') );
  return button;
}

function createVolumeSlider() {
  return createElement({
    type: 'input',
    classes: 'slider volume',
    attrs: {
      'type': 'range',
      'name': 'volume',
      'title': 'Volume',
      'min': 0, 'max': 1, 'step': 0.01, //// Range 0-1 for simple lerping
      'value': 1,
      'tabindex': -1
    }
  });
}

function createSpeedSlider() {
  return createElement({
    type: 'input',
    classes: 'slider speed',
    attrs: {
      'type': 'range',
      'name': 'speed',
      // 'min': 0.5, 'max': 2, 'step': 0.5, //// Actual choices: 0.5, 1, 1.5, 2
      // 'min': 0.25, 'max': 1.75, 'step': 0.25, //// Actual choices: 0.25, 0.5, 1, 1.25, 1.5
      // 'min': 0.5, 'max': 1.5, 'step': 0.25, //// Actual choices: 0.25, 0.5, 1, 1.25, 1.5
      'min': 0, 'max': 4, 'step': 1, //// Values are index of `speedOptions` array above
      'value': 2,
      'tabindex': -1
    }
  });
}
