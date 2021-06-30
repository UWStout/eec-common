export function makeLogger (label, backgroundColor, textColor) {
  const newLogger = logger.bind(this, label, backgroundColor, textColor)
  newLogger.error = error.bind(this, label, backgroundColor, textColor)
  return newLogger
}

export function logger (label, backgroundColor, textColor, ...rest) {
  console.log(`%c[[${label}]]`, `background: ${backgroundColor}; color: ${textColor}`, ...rest)
}

export function error (label, backgroundColor, textColor, ...rest) {
  console.error(`%c[[${label}]]`, `background: ${backgroundColor}; color: ${textColor}`, ...rest)
}
