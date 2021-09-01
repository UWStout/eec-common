import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Typography, FormControl, FormControlLabel, RadioGroup, Radio } from '@material-ui/core'

import PrivacyPolicy from '../sharedComponents/PrivacyPolicy.jsx'

export default function PrivacyConsentForm (props) {
  // De-construct props
  const { setNextStepEnabled } = props

  // Privacy radio button states
  const [privacyConsentState, setPrivacyConsentState] = useState('')
  const onUpdatePrivacyConsent = (e) => {
    setPrivacyConsentState(e.target.value)
  }

  // Synchronize the next-step enabled state with privacy consent values
  useEffect(() => {
    if (setNextStepEnabled) {
      setNextStepEnabled(privacyConsentState === 'accept')
    }
  }, [privacyConsentState, setNextStepEnabled])

  return (
    <React.Fragment>
      <Typography variant="h6" component="h2" gutterBottom>
        {'Karuna Extension Privacy Policy'}
      </Typography>
      <PrivacyPolicy />
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="privacy consent"
          name="privacyConsent"
          value={privacyConsentState}
          onChange={onUpdatePrivacyConsent}
        >
          <FormControlLabel value="decline" control={<Radio />} label="Do not use my data" />
          <FormControlLabel value="accept" control={<Radio />} label="I have read and agree" />
        </RadioGroup>
      </FormControl>
    </React.Fragment>
  )
}

PrivacyConsentForm.propTypes = {
  setNextStepEnabled: PropTypes.func
}

PrivacyConsentForm.defaultProps = {
  setNextStepEnabled: null
}
