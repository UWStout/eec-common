import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper, FormControl, FormControlLabel, RadioGroup, Radio } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  privacyText: {
    maxHeight: '300px',
    overflowY: 'auto',
    margin: theme.spacing(2),
    padding: theme.spacing(2)
  }
}))

export default function PrivacyConsentForm (props) {
  // Create class names for styling
  const classes = useStyles()

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
      <Typography variant="h6" gutterBottom>
        {'Karuna Extension Privacy Policy'}
      </Typography>
      <Paper elevation={0} square variant="outlined" className={classes.privacyText}>
        <Typography variant="body2">
          {'We recognize and respect your privacy as you use this UW System WiSys funded research tool.'}
          <br />
          <br />
          {'While using this extension, the following information is gathered for the purposes of improving '}
          {'the software and enabling its core features. The information collected, stored and processed are '}
          {'limited to your:'}
          <ul>
            <li>{'Email and password for logging into Karuna'}</li>
            <li>{'Karuna team affiliations'}</li>
            <li>{'Current and historical emotional affect (mood) as shared with the system'}</li>
            <li>{'Preferred name and pronouns for sharing with Karuna team members'}</li>
            <li>{'Microsoft Teams and Discord message content, which is stored anonymously for tracking message history and emotional tone'}</li>
            <li>{'Teams and Discord message content, sent anonymously to IBM Watson for sentiment analysis'}</li>
          </ul>
          <br />
          {'In processes between the extension and Discord, Teams, and IBM Watson, none of your personally identifiable '}
          {'information is shared or seen by these services.'}
          <br />
          <br />
          {'Finally, none of the above information is given or sold to any outside organization, and is used only to '}
          {'determine the efficacy and meet the goals of this specific research project, which ends on 12/31/2021.'}
        </Typography>
      </Paper>

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
