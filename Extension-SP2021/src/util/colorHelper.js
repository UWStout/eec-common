export function stringToColor (str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let hexColor = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF
    hexColor += padZero(value.toString(16))
  }

  return hexColor
}

export function getContrastingColor (hex, bw = true) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }

  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.')
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF'
  }

  // Invert color components
  const invR = (255 - r).toString(16)
  const invG = (255 - g).toString(16)
  const invB = (255 - b).toString(16)

  // Pad each with zeros and return
  return '#' + padZero(invR) + padZero(invG) + padZero(invB)
}

function padZero (str) {
  return ('00' + str).substr(-2)
}
