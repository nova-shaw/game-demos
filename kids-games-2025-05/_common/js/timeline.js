const defaults = {
  duration: 0,
  intervals: ['hi'],

  frameCallback: null,
  startCallback: null,
  pauseCallback: null,
  cancelCallback: null
};

export class Timeline {
  constructor(config) {
    this.config = {...defaults, ...config};

    this.running = false;
    this.startat = 0;
    this.elapsed = 0; // How many ms have passed since play was pressed
    this.intervalIndex = 0;
    this.triggerInterval = true; // used to trigger interval callback at START of elapsed time
  }

  report() {
    console.log(this.config);
  }
}