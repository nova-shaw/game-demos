
const cursor = document.querySelector('#cursor');
document.body.addEventListener('mousemove', e => {
  cursor.style = `translate: ${e.pageX}px ${e.pageY}px`;
}, false);

