import passwordsText from 'passwd-strength/passwords.txt'
import passwdStrength from 'passwd-strength/passwd-strength'

// 29 bits of entropy implies a 1-in-1000 chance of
// guessing the password after 500,000 tries
const MIN_ENTROPY = 50

// Make the password list
const passwordList = passwordsText.toString().split('\n')

// Forbidden characters
const FORBIDDEN = /[\s<>]/g

export function validatePassword (newPassword) {
  // Ignore blank passwords (they should be handled before this step)
  if (typeof newPassword !== 'string' || newPassword === '') {
    return [0, '']
  }

  // Check for forbidden characters
  if (newPassword.match(FORBIDDEN)) {
    return [0, 'You cannot use the symbols < and > or spaces.']
  }

  // Check for common passwords
  if (passwordList.indexOf(newPassword.toLowerCase()) !== -1) {
    return [0, 'You may not use common/well known passwords']
  }

  // Compute bits of entropy
  const strength = passwdStrength(newPassword)

  // Password is not complex enough
  if (strength < MIN_ENTROPY) {
    return [strength, 'Please use a more complex password']
  }

  // Password is sufficiently complex
  return [strength, '']
}
