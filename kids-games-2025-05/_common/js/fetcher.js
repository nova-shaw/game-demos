
export async function all(fileArray, path = null) {

  const pathString = path || '';

  // Build 'promises' array with each 'file' wrapped in a `fetch()` then a json decode
  const promises = [];
  fileArray.forEach( file => {
    promises.push( fetch(`${pathString}${file}`).then( async r => await r.json() ) );
  });

  // Wait for all promises to complete
  const responses = await Promise.all(promises); // Are we sure the array order coming out is the same as the order going in? - Yes: https://stackoverflow.com/a/28066851
  
  return responses;
}