// Store2 local storage library
import store from 'store2'
import compareVersions from 'compare-versions'

/**
 * Read a value from the extension's LocalStorage. The string 'key/context' should be
 * unique. If no context is provided, then key itself should be unique.
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
 * unique. If no context is provided, then key itself should be unique.
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
    console.log(`[[Background]] No writing value for ${keyContext} because overwrite is false`)
    return false
  }

  // Write the variable and return success
  console.log(`[[Background]] Setting ${keyContext} to ${data}`)
  store.local.set(keyContext, data, true)
  return true
}

/**
 * Clear a value from the extension's LocalStorage. The string 'key/context' should be
 * unique. If no context is provided, then key itself should be unique.
 * @param {string} key Unique identifier ("name") for the value
 * @param {string} [context] Name of a context (matching those in util/contexts.js)
 */
export function clearValue (key, context) {
  const keyContext = context ? `${context}/${key}` : key
  return store.local.remove(keyContext)
}

/**
 * This function reads any stored version number from local storage and compares it
 * to the current extension version. If they are different, it will clear all stored
 * data and tokens in order to prevent any conflicts that may arise. It then writes
 * the current extension version into local storage for future checks.
 */
export function checkForVersionConflict () {
  const previousVersion = readValue('karunaVersion') || '0.0.0'
  if (compareVersions(_VER_, previousVersion) !== 0) {
    store.clearAll()
  }
  writeValue('karunaVersion', _VER_)
}

/**
 * Decode the payload of an encoded JWT without regard for weather it passes
 * signature verification or is expired.
 * @param {string} JWT A properly encoded (but possibly invalid) json web token
 * @returns {object} The payload parsed into a JS object
 */
export function decodeJWTPayload (JWT) {
  try {
    // Base64 decode second field in the token (the payload)
    const jsonStr = atob(JWT.split('.')[1])
    return JSON.parse(jsonStr)
  } catch (err) {
    console.log('[[BACKGROUND]]: Error decoding JWT')
    console.log(err)
    return undefined
  }
}

/**
 * Retrieve the JWT stored in this extension's local storage (only if not expired).
 * If the token is expired, this function will clear the token from storage and return
 * undefined.
 * @returns {string|object} The raw JWT string or the payload decoded to a JS object
 */
export function retrieveToken (decode = false) {
  // Read from local storage and return nothing if not defined
  const JWT = readValue('JWT')
  if (!JWT) { return }

  // Check if the token has expired
  const jsonObj = decodeJWTPayload(JWT)
  if (Math.floor(Date.now() / 1000) < (jsonObj?.exp ? jsonObj.exp : 0)) {
    return (decode ? jsonObj : JWT)
  }

  // Clear stale token
  console.log('JWT has expired, clearing.')
  clearValue('JWT')
  return undefined
}

/**
 * Attempt to decode the locally stored JWT and return simple user info (db id,
 * email, first and last name, user type). If the JWT is not found or is expired
 * it will return an empty object.
 * @returns {object} Basic user info as decoded from the stored JWT
 */
export function retrieveUser () {
  // Try to retrieve and decode the JWT
  const jsonObj = retrieveToken(true)
  if (jsonObj?.id) {
    return {
      id: jsonObj.id,
      email: jsonObj.email || '',
      name: jsonObj.name || '',
      preferredName: jsonObj.preferredName || '',
      preferredPronouns: jsonObj.preferredPronouns || '',
      userType: jsonObj.userType || 'standard'
    }
  }

  // Failed to retrieve or decode
  return {}
}
