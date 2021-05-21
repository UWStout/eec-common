export function makeLogger (label, backgroundColor, textColor) {
  return logger.bind(this, label, backgroundColor, textColor)
}

export function logger (label, backgroundColor, textColor, ...rest) {
  console.log(`%c[[${label}]]`, `background: ${backgroundColor}; color: ${textColor}`, ...rest)
}
