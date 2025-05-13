/*
  ALL THIS DOES is return an *index* at a given period (interval)
  to any provided callback functions
*/


//////////////////// Module-scoped globals

//// Default Options
const opts = {
  interval: 1000, //// How long (milliseconds) is each interval
  intervalGap: 0, //// How long (milliseconds) is the gap between each interval
  maxIndex: 10,
  triggerOnPlay: true, //// dont wait for first interval to finish before calling first onInterval callback
  playBackwards: false,
  playRandom: false //// false = linear, true = random
}

//// Callbacks on Interval
const cbacks = {
  onStart: null,
  onEnd: null
}

//// Internals
let playing = false;

let index = 0;
let previousIndexes = []; //// For random playback, keep track of recently used indexes so we don't repeat them
const rememberPrevious = 2; //// How many recent indexes to remember and exclude from random playback
let shown = [];

let zero = document.timeline.currentTime;
let withinGap = false; //// is the current time within a gap or a specified interval?
let elapsed = 0;


//////////////////// Exports

//// Settings

export function settings({ interval, intervalGap, maxIndex, triggerOnPlay, playBackwards, playRandom, intervalStartCallback, intervalEndCallback } = {}) {

  // Set options
  if (interval != undefined)      opts.interval = interval;
  if (intervalGap != undefined)   opts.intervalGap = intervalGap;
  if (maxIndex != undefined)      opts.maxIndex = maxIndex;
  if (triggerOnPlay != undefined) opts.triggerOnPlay = triggerOnPlay;
  if (playBackwards != undefined) opts.playBackwards = playBackwards;
  if (playRandom != undefined)    opts.playRandom = playRandom;

  // On load or when not playing, if playback is set to random, choose random starting index (so not always starting on 0)
  if (playing == false && playRandom == true) {
    index = randomIntInclusive(0, opts.maxIndex);
    previousIndexes.push(index);
  }

  // Set callbacks
  if (intervalStartCallback) cbacks.onStart = intervalStartCallback;
  if (intervalEndCallback)   cbacks.onEnd = intervalEndCallback;
  
}

//// Playback Controls

export function play() {
  playing = true;
  if (opts.triggerOnPlay && cbacks.onStart) cbacks.onStart(index);
  console.log(previousIndexes);
  // previousIndexes.forEach( i => { cbacks.onEnd(i) }); //// Safety
  // shown.forEach( i => { cbacks.onEnd(i) }); //// Safety
  zero = document.timeline.currentTime;
  animate(document.timeline.currentTime);
}

export function pause() {
  playing = false;
}

export function intervalSet(ms) {
  opts.interval = ms;
}

export function gapSet(ms) {
  opts.intervalGap = ms;
}



//////////////////// Internals



//// Main Animate Loop

function animate(timestamp) {

  if (!playing) return; //// Exit animate loop if paused

  elapsed = timestamp - zero; //// timestamp is always total continuous MS that the window has been open

  const limit = withinGap ? opts.intervalGap : opts.interval; //// Which are we timing, interval or intervalGap?

  if (elapsed > limit) {

    // When gap is finished, call 'start' on next index
    if (withinGap) {
      index = chooseNextIndex();
      cbacks.onStart(index);

    // When interval is finished, call 'end' on current index
    } else {
      cbacks.onEnd(index);
      shown.forEach( i => { cbacks.onEnd(i) });
      shown = [];
    }

    // Invert gap and reset zero
    withinGap = !withinGap;
    zero = document.timeline.currentTime;
  }

  requestAnimationFrame(animate);
}


//// Choosing the next index

function chooseNextIndex() {

  let chosen;

  //// Random playback is only possible if there are three or more options to choose from
  if (opts.playRandom && (opts.maxIndex + 1) - rememberPrevious >= 3) {
    chosen = nextIndexRandom(previousIndexes);

  //// Linear playback
  } else {
    if (opts.playBackwards) {
      chosen = nextIndexDown(index, opts.maxIndex);

    } else {
      chosen = nextIndexUp(index, opts.maxIndex);
    }
  }

  shown.push(chosen);
  console.log('shown', shown);

  //// Always remember chosen index, trim previousIndexes array from front if needed
  console.log(previousIndexes);
  previousIndexes.push(chosen);
  console.log(previousIndexes);
  if (previousIndexes.length > rememberPrevious) {
    previousIndexes.shift();
  }

  return chosen;
}

function nextIndexUp(index, max) {
  return (index < max) ? index + 1 : 0;
}

function nextIndexDown(index, max) {
  return (index <= 0) ? max : index - 1;
}

function nextIndexRandom(excludeArray) { //// Choose random index, excluding previousIndexes
  let chosen = null;
  while (chosen === null) {
    const candidate = randomIntInclusive(0, opts.maxIndex);
    if (excludeArray.indexOf(candidate) === -1) chosen = candidate;
  }
  return chosen;
}

//// Utils

function randomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}
