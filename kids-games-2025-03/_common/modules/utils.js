export function lerp(norm, min, max) { //// lerp = linear interpolation: 0-1 mapped to real range
  return (max - min) * norm + min;
}

export function norm(value, min, max) { //// norm = normalization: real range mapped to 0-1
  return (value - min) / (max - min);
}

export function decimals(value, precision) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function stripExtraSlashes(str) { //// Thanks: https://stackoverflow.com/a/36242700
  const str0 = str.replace(/\/+/g, '/'); //// convert any multiple slashes (ie '////') into a single slash
  const str1 = str0.endsWith('/') ? str0.slice(0, -1) : str0; //// remove any trailing slash
  const str2 = str1.startsWith('/') ? str1.slice(1) : str1; //// remove any leading slash
  return str2;
}


// Easing functions, all 0-1, thanks https://easings.net/

export function easeInQuad(x) {
  return x * x;
}

export function easeInCubic(x) {
  return x * x * x;
}

export function easeInQuart(x) {
  return x * x * x * x;
}

export function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}

export function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

export function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}