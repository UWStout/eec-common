// Run this in the browser console to list any styles that are being defined more than once
Array.from(document.querySelector('eec-unified').shadowRoot.querySelectorAll('style[data-meta]'))
  .map((item) => item.dataset.meta)
  .filter((item, index, arr) => (item.includes('Mui') && arr.indexOf(item, index + 1) !== -1))
