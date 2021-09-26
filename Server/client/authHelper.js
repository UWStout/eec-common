import axios from 'axios'
import store from 'store2'
import Cookies from 'js-cookie'

// Destination URL after login
let destURL = ''

// The retrieved token, if found
let token = ''

export function extractDestination () {
  // Determine the destination URL to redirect to after login
  destURL = (new URLSearchParams(window.location.search)).get('dest')
  if (!destURL || destURL === '') {
    destURL = 'dbAdmin/Teams.html'
  }

  // Log the extracted URL (or the default)
  console.log('After login, will redirect to: ' + destURL)
}

/**
 * Decode a token and check its expiration and structure
 *
 * @param {string} emailToken A JWT generated for email verification or password reset
 */
export function checkToken (emailToken) {
  try {
    // Decode and fix any URL encoding issues
    const base64URL = emailToken.split('.')[1]
    const base64 = base64URL.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join('')
    )

    // Parse JSON into object
    const tokenInfo = JSON.parse(jsonPayload)

    // Check structure
    if (!tokenInfo?.exp || !tokenInfo?.id) {
      return false
    }

    // Check expiration
    if (Math.floor(Date.now() / 1000) < tokenInfo.exp) {
      return true
    }
  } catch (err) {
    console.error('Error decoding token')
    console.error(err)
  }

  return false
}

/**
 * A function to quickly check the validity of the stored JWT and bypass
 * login if it is still valid. Runs asynchronously and requires callback.
 * @param {function} result Callback, receives bool for if login is 'valid' and message as string
 */
export function preValidate (result) {
  if (checkForToken()) {
    // Validate and redirect
    axios.get('./auth/validate', {
      headers: {
        Authorization: `digest ${token}`
      }
    }).then((response) => {
      result(true, 'Login valid. Redirecting ...')
      setTimeout(() => { window.location.href = destURL }, 1500)
    }).catch(() => {
      // Token did not validate
      store.local.remove('JWT')
      Cookies.remove('JWT')
      result(false, 'Token invalid/expired, please sign in again')
    })
  } else {
    // No token found
    result(false, 'No prior credentials, please sign in')
  }
}

/**
 * Given email and password, this function will attempt to validate the user using the authorization
 * backend. It will receive and store an authorization JWT on success and redirect to to the given URL.
 * @param {string} email Email address for the user account
 * @param {string} password Plain-text password for the user account
 * @param {number} expiration Time in hours until the token expires (default: 24h, min: 1h, max: 120h / 5 days)
 * @param {function} onSuccess Callback, runs if the login info is valid (prior to redirect)
 * @param {function} onFailure Callback, runs if the login info is invalid
 * @returns {Promise} A promise that will resolve on completion (regardless of success or failure)
 */
export async function validateLogin (email, password, expiration, onSuccess, onFailure) {
  // Sanitize "expires"
  if (typeof expiration !== 'number') { expiration = 24 }
  if (expiration < 1) { expiration = 1 }
  if (expiration > 168) { expiration = 168 }

  try {
    // Try to send the login request
    const response = await axios.post('./auth/login', { email, password, expiration })

    // Call the Success callback
    if (onSuccess) { onSuccess() }

    // Set the token and redirect
    store.local.set('JWT', response.data)
    Cookies.set('JWT', response.data)
    setTimeout(() => { window.location.href = destURL }, 1000)
  } catch (err) {
    // Call the failure callback
    if (onFailure) {
      onFailure(err)
    }
  }
}

/**
 * Check if an email is already in use by another account.
 * @param {string} email Email to check for conflict (already registered)
 * @returns {Promise} resolves if not in conflict, rejects in all other cases
 */
export async function checkEmailConflict (email) {
  return new Promise((resolve, reject) => {
    // Try to send the register request
    axios.post('./auth/email', { email })
      .then(() => { resolve() })
      .catch((err) => { reject(err) })
  })
}

/**
 * Attempt to create a new user
 * @param {object} newUser Object with 'name', 'preferredName', 'preferredPronouns', 'email', and 'password'
 * @returns {Promise} Resolves or rejects based on success
 */
export function createAccount (newUser) {
  return new Promise((resolve, reject) => {
    // Try to send the register request
    axios.post('./auth/register', newUser)
      .then((response) => {
        // Next, request for the authorization email to be sent
        axios.post('./auth/verify', { email: newUser.email })
          .then((verifySuccess) => {
            resolve({ ...(response.data), verifySuccess })
          })
          .catch((err) => { reject(err) })
      })
      .catch((err) => { reject(err) })
  })
}

/**
 * Attempt to reset a user's password
 * @param {string} email An email address that may or may not be an account email
 * @returns {Promise} Resolves or rejects based on success
 */
export function requestRecovery (email) {
  return new Promise((resolve, reject) => {
    // Try to send the password reset request
    axios.post('./auth/recover', { email })
      .then((response) => { resolve(response.data) })
      .catch((err) => { reject(err) })
  })
}

/**
 * Attempt to reset a user's password
 * @param {string} token A token generated specific to allow password resetting
 * @param {string} password The new password in plain-text
 * @returns {Promise} Resolves or rejects based on success
 */
export function resetAccountPassword (token, password) {
  return new Promise((resolve, reject) => {
    // Try to send the password reset request
    axios.post('./auth/setNewPassword', { token, password })
      .then((response) => { resolve(response.data) })
      .catch((err) => { reject(err) })
  })
}

/**
 * Attempt to validate an email token
 * @param {string} token A token generated specific to allow password resetting
 * @returns {Promise} Resolves or rejects based on success
 */
export function submitValidationToken (token) {
  return new Promise((resolve, reject) => {
    // Try to send the password reset request
    axios.post('./auth/validateEmail', { token })
      .then((response) => { resolve(response.data) })
      .catch((err) => { reject(err) })
  })
}

// Check the token and refresh the cookie
function checkForToken () {
  token = store.local.get('JWT')
  if (!token || token === '') { return false }
  Cookies.set('JWT', token)
  return true
}
