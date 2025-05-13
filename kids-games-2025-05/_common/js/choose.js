
// const log = console.log;

let indexArray = [];
let history = [];
let historyMax = 3;

export function setup(numberOfItems) {
  indexArray = Array.from(Array(numberOfItems).keys()); // Create an array of indexes, one for each of the items
  setHistoryMax(numberOfItems); // Set how many to remember for exclusion
  history = [];
}


///////////////////////////////////////////////////////////////

export function next() {
  let result = 0;
  if (history.length > 0 && history[0] < indexArray.length - 1) { // Only increment if there's a history AND the history value is not at the end
    result = history[0] + 1;
  }
  history[0] = result;
  return indexArray[result];
}

export function nextReverse() {
  let result = indexArray.length - 1;
  if (history.length > 0 && history[0] > 0) { // Only decrement if there's a history AND the history value is not at the start
    result = history[0] - 1;
  }
  history[0] = result;
  return indexArray[result];
}

export function random() {
  const index = randomIndexExclude(0, indexArray.length - 1, history);
  history.unshift(index); // Add to front of array so `.length` trim doesn't remove it
  if (history.length > historyMax) history.length = historyMax; // Trim array from front
  return indexArray[index]; // Return the index AT THE INDEX (not the index itself)
}

export function removeIndex(index) {
  indexArray.splice(indexArray.indexOf(index), 1); // Remove the index AT THE INDEX (not the index itself)
  setHistoryMax(indexArray.length); // Update how many to remember for exclusion
  history.length = 1; // Reset exclusion memory, keep single value for linear next() and nextReverse()
  return indexArray; // Send remaining options back if needed
}

export function addIndex(index) {
  if (indexArray.indexOf(index) > -1) return;

  indexArray.push(index); 
  indexArray.sort();
  setHistoryMax(indexArray.length); // Update how many to remember for exclusion
  return indexArray; // Send remaining options back if needed
}


///////////////////////////////////////////////////////////////

// Fine-tune how many to remember for exclusion
function setHistoryMax(length) {
  if (length <= 1) { historyMax = 0 } else // 0, 1 = nothing
  if (length == 2) { historyMax = 1 } else
  if (length <  5) { historyMax = length - 2 } else // 3, 4 = 1, 2
  if (length >= 5) { historyMax = 3 }
}

// Choose random index, excluding any in passed array
function randomIndexExclude(min, max, excludeArray = []) {
  let chosen = null;

  // Only a single choice: not random, choose the only one
  if (max - min == 0) {
    chosen = 0;

  // Only two choices: not random, just flip between them
  } else if (max - min == 1) {
    chosen = excludeArray[0] == 0 ? 1 : 0;

  // Three or more choices: actually random(ish)
  } else {
    let tries = 0;
    while (chosen === null) { // Reject and re-sample random candidate until not found in exclude list
      if (tries >= 13) { chosen = min; } // Safety: exit while() after max tries
      else {
        tries++;
        const candidate = randomIntInclusive(min, max);
        if (excludeArray.indexOf(candidate) === -1) chosen = candidate; // if not in exclude list, accept candidate
      }
    }
  }
  return chosen;
}


// Choose random integer, inclusive of min and max
function randomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}