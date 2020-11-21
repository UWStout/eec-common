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
