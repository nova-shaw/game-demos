
////////////////////////////////////////////////////////////

export async function popWindow(url, windowName) {
  const coords = getSavedWindowCoords(windowName);
  return await window.open(url, windowName, `popup=true,menubar=false,${coords}`); // Returns reference to popped window
}

////////////////////////////////////////////////////////////
// Message Bus for communication between windows

export function messageBusStart() {
  return new BroadcastChannel("messagebus");
}


////////////////////////////////////////////////////////////
// Saving/Getting window coordinates with localStorage

const windowCoordsDefaults = {
  nto_resources: { w: 420, h: 600, x: 10,  y: 50 },
  nto_display:   { w: 800, h: 600, x: 600, y: 200 }
}

export function saveWindowCoords(windowName) {
  const localStorageVariableName = `${windowName}_coords`;
  const w = window.innerWidth;
  const h = window.innerHeight + 1; //// seems to lose a single pixel height each time opened/closed...
  const x = window.screenX;
  const y = window.screenY;
  localStorage.setItem(localStorageVariableName, `width=${w},height=${h},left=${x},top=${y}`);
}

function getSavedWindowCoords(windowName) {
  const localStorageVariableName = `${windowName}_coords`;
  const lsValue = localStorage.getItem(localStorageVariableName);
  if (lsValue) {
    return lsValue;
  } else {
    //// if localStorage var not found, use the `windowName` to grab the defaults
    let coords = windowCoordsDefaults[windowName];
    if (!coords) coords = { w: 420, h: 420, x: 50,  y: 50 }; //// another fallback in case window names are changed and defaults are not found
    return `width=${coords.w},height=${coords.h},left=${coords.x},top=${coords.y}`
  }
}
