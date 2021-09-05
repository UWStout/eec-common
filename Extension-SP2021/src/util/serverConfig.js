/* global _DEV_ */

// Settings for server communication
export const DOMAIN = (_DEV_ ? 'localhost' : 'karuna.run')
export const HOST_NAME = (_DEV_ ? `${DOMAIN}:3000` : DOMAIN)
export const ROOT = (_DEV_ ? '' : '')
