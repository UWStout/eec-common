import PropTypes from 'prop-types'

// Affect data structure from the DB
export const AffectObjectShape = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  characterCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  related: PropTypes.arrayOf(PropTypes.string),
  active: PropTypes.bool
}

export const TimeToRespondShape = {
  time: PropTypes.number,
  units: PropTypes.string,
  automatic: PropTypes.bool
}

// User status structure from the DB
export const StatusObjectShape = {
  currentAffectID: PropTypes.string,
  collaboration: PropTypes.string,
  timeToRespond: PropTypes.shape(TimeToRespondShape)
}

// Messaging context alias and avatar info
export const ContextAliasShape = {
  msTeams: PropTypes.string,
  discord: PropTypes.string,
  slack: PropTypes.string,
  avatar: PropTypes.shape({
    msTeams: PropTypes.string,
    discord: PropTypes.string,
    slack: PropTypes.string
  })
}

// Basic user info shape (from token with 'id')
export const BasicUserInfoShape = {
  id: PropTypes.string,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  preferredName: PropTypes.string.isRequired,
  preferredPronouns: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired
}

// Extended user info shape (from DB with '_id', 'contextAlias', and 'status')
export const ExtendedUserInfoShape = {
  _id: PropTypes.string,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  preferredName: PropTypes.string.isRequired,
  preferredPronouns: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  contextAlias: PropTypes.shape(ContextAliasShape),
  status: PropTypes.shape(StatusObjectShape)
}

export const PrivacyObjectShape = {
  private: PropTypes.bool,
  noPrompt: PropTypes.bool
}

/** Default objects to use when none are available */
export const DEFAULT = {
  AffectObjectShape: {
    _id: '',
    name: '',
    description: '',
    characterCodes: ['X'],
    related: [],
    active: false
  },

  TimeToRespondShape: {
    time: -1,
    units: 'm',
    automatic: false
  },

  StatusObjectShape: {
    currentAffectID: '',
    collaboration: '',
    timeToRespond: {
      time: -1,
      units: 'm',
      automatic: false
    }
  },

  PrivacyObjectShape: {
    private: true,
    noPrompt: false
  }
}
