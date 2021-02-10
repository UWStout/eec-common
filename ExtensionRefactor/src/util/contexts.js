// String context identifiers
export const CONTEXT = {
  MS_TEAMS: 'msTeams',
  DISCORD: 'discord',
  SLACK: 'slack'
}

// Verify a context string
export function isValidContext (context) {
  return Object.values(CONTEXT).find(curValue => (context === curValue))
}

// Check the current team and channel to see if it is valid (e.g. Karuna should be active)
export function isValidChannel (teamName, channelName, context) {
  // Different depending on the app context
  switch (context) {
    case CONTEXT.DISCORD:
      return (channelName !== 'Discord' && teamName !== '' && !teamName.toLowerCase().includes('find or start'))

    case CONTEXT.MS_TEAMS:
      return (channelName !== undefined && channelName !== '' && teamName !== undefined && teamName !== '')

    // Default to invalid
    default:
      return false
  }
}
