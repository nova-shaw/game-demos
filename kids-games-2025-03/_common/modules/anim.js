import { lerp } from './utils.js';

// const log = console.log;

let animDuration = 1000;
let animCallback = null
let animToggle   = null;
let animRange    = null;

export function setup(btnPlay = null, rngTime = null, duration = null, frameCallback = null) {

  if (btnPlay) {
    
    animToggle = btnPlay;

    animToggle.addEventListener('click', () => {
      if (playing) { pause() }
        else { play() }
    });
  }

  if (rngTime) {
    
    animRange = rngTime;

    animRange.addEventListener('pointerdown', e => {
      playOnRelease = playing;
      playing = false;
      jumpFromRange(e);
    });

    animRange.addEventListener('input', e => {
      jumpFromRange(e);
    });

    animRange.addEventListener('pointerup', e => {
      if (playOnRelease) play();
    });
  }

  if (frameCallback) {
    animCallback = frameCallback;
  }

  if (duration) {
    animDuration = duration;
  }
}



/*animReveal.addEventListener('click', e => {
  // duration = 1000;
  play(1000);
})*/


///////////////////////////////////////////////////////////////
// Animation internals

// const durationMain = 10000;

let duration = animDuration;
let playing = false;
let elapsed = 0;
let startAt = 0;
let zero = 0;
let playOnRelease = false;

function animationLoop(timestamp) {

  if (!playing) return;

  requestAnimationFrame(animationLoop);

  elapsed = startAt + (timestamp - zero);

  const per = (elapsed / duration);
  animRange.value = per;

  if (animCallback) animCallback(per); // Callback every frame, returns `per`cent float 0-1

  if (elapsed >= duration) {
    end();
  }
}

export function play(durationOnce = null) {
  if (durationOnce) {
    startAt = durationOnce * (elapsed / duration);
    duration = durationOnce;
  }
  playing = true;
  zero = document.timeline.currentTime;
  animationLoop(zero);
}

export function pause() {
  duration = animDuration;
  startAt = elapsed;
  // log(startAt);
  playing = false;
}

function end() {
  duration = animDuration;
  elapsed = 0;
  animRange.value = 1;
  animCallback(1);
  playing = false;
}

export function reset() {
  duration = animDuration;
  startAt = 0;
  animRange.value = 0;
  playing = false;
}

export function jump(per) {
  startAt = lerp(per, 0, duration);
  animRange.value = per;
  animCallback(per);
}

function jumpFromRange(e) { // Same as `jump()` but doesn't set UI range value
  startAt = lerp(e.currentTarget.value, 0, duration);
  elapsed = startAt;
  animCallback(e.currentTarget.value);
}
