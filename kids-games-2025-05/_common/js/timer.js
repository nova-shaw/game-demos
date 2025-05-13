
export class Timer {
  #startat;
  #elapsed;
  #intervalIndex;
  #triggerInterval;

  constructor(intervals, startCallback = null, pauseCallback = null, cancelCallback = null) {
    this.intervals      = intervals;
    this.startCallback  = startCallback;
    this.pauseCallback  = pauseCallback;
    this.cancelCallback = cancelCallback;
    this.running        = false;

    this.#startat = 0;
    this.#elapsed = 0;
    this.#intervalIndex = 0;
    this.#triggerInterval = true; // used to trigger interval callback at START of elapsed time
  }

  start(setIntervalIndex = null) {
    if (setIntervalIndex != null) this.#intervalIndex = setIntervalIndex;

    this.running = true;
    this.#startat = performance.now();
    
    if (this.startCallback) this.startCallback(0);

    this.#loop(this.#startat);
    return this.running;
  }

  pause() {
    this.running = false;
    if (this.pauseCallback) this.pauseCallback(this.#elapsed);
    return this.running;
  }

  toggle(setIntervalIndex = null) {
    if (setIntervalIndex != null) this.#intervalIndex = setIntervalIndex;

    if (this.running) {
      this.pause();
    } else { 
      this.start(setIntervalIndex);
    }
    return this.running;
  }

  cancel() {
    this.running = false;
    if (this.cancelCallback) this.cancelCallback();
    return this.running;
  }

  // Change the length ([value] in milliseconds) of interval at [index] in array [this.intervals]
  updateInterval(index, value) {
    this.intervals[index].ms = value;
  }

  #loop = (timestamp) => {
    if (!this.running) return;

    this.#elapsed = timestamp - this.#startat;

    if (this.#triggerInterval) {
      this.intervals[this.#intervalIndex].fn(this.#elapsed);
      this.#triggerInterval = false;
    }

    if (this.#elapsed >= this.intervals[this.#intervalIndex].ms) {
      this.#intervalIndex = (this.#intervalIndex == this.intervals.length - 1) ? 0 : this.#intervalIndex + 1;
      // console.log(this.#intervalIndex);
      this.#triggerInterval = true;
      this.#startat = timestamp;
    }

    requestAnimationFrame(this.#loop);
  }
}