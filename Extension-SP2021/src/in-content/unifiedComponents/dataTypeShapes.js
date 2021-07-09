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

// User status structure from the DB
export const StatusObjectShape = {
  currentAffectID: PropTypes.string,
  collaboration: PropTypes.bool,
  timeToRespond: PropTypes.number
}

export const PrivacyObjectShape = {
  private: PropTypes.bool,
  prompt: PropTypes.bool
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

  StatusObjectShape: {
    currentAffectID: '',
    collaboration: false,
    timeToRespond: -1
  },

  PrivacyObjectShape: {
    private: true,
    prompt: true
  }
}
