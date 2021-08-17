export function animateCSS (elementSelector, animation, repeat = 1, prefix = 'animate__') {
  // We create a Promise and return it
  return new Promise((resolve, reject) => {
    // Get reference to our node
    const node = document.querySelector('eec-unified').shadowRoot.querySelector(elementSelector)

    // Add animation classes
    const animationName = `${prefix}${animation}`
    const repeatName = `${prefix}repeat-${repeat}`
    node.classList.add(`${prefix}animated`, animationName, repeatName)

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd (event) {
      event.stopPropagation()
      node.classList.remove(`${prefix}animated`, animationName, repeatName)
      resolve('Animation ended')
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true })
  })
}
