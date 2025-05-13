
import { svgIcons } from './svg-icons-v3.js';

//// Just finds requested icon id (`svgID`) object within array (`svgIcon`)
export function createSVG(svgID, outputID = null) {
  const svgObject = svgIcons[svgID];
  return buildSVG(svgObject, svgID, outputID);
}

function buildSVG(obj, svgID, outputID = null) {

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add(svgID.replaceAll('_', '-'));
  if (outputID) svg.setAttribute('id', outputID);
  svg.setAttribute('width', obj.size.width);
  svg.setAttribute('height', obj.size.height);
  svg.setAttribute('viewBox', `0 0 ${obj.size.width} ${obj.size.height}`);

  obj.nodes.forEach( item => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", item.name);
    
    if (item.classes) {
      for (const c of item.classes) {
        node.classList.add(c);
      }
    }
    
    for (const attr in item.attrs) {
      node.setAttribute(attr, item.attrs[attr]);
    }
    svg.appendChild(node);
  });

  return svg;
}