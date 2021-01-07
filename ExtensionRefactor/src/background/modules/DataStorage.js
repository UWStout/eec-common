// Store2 local storage library
import store from 'store2'

/**
 * Read a value from the extension's LocalStorage. The string 'key/context' should be
 * unique. If not context is provided, then key itself should be unique.
 * @param {string} key Unique identifier ("name") for the value
 * @param {string} [context] Name of a context (matching those in util/contexts.js)
 * @return {any} The original value stored for the given key (possibly 'undefined')
 */
export function readValue (key, context) {
  const keyContext = context ? `${context}/${key}` : key
  return store.local.get(keyContext)
}

/**
 * Write a value to the extension's LocalStorage. The string 'key/context' should be
 * unique. If not context is provided, then key itself should be unique.
 * @param {string} key Unique identifier ("name") for the value
 * @param {any} data Object containing the data to be stored.
 * @param {string} [context] Name of a context (matching those in util/contexts.js)
 * @param {boolean} [overwrite=true] Whether or not to overwrite an existing value.
 * @return {boolean} True if the data was written, false if not.
 */
export function writeValue (key, data, context, overwrite = true) {
  // Build unique key
  const keyContext = context ? `${context}/${key}` : key

  // Check for and avoid overwriting
  if (store.local.get(keyContext) !== undefined && !overwrite) {
    return false
  }

  // Write the variable and return success
  store.local.set(keyContext, data, true)
  return true
}
