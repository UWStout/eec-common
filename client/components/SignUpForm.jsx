import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { useRecoilValue } from 'recoil'
import { FullNameState, PreferredNameState, PreferredPronounsState, EmailState, PasswordState } from '../globalData.js'

import { Paper, Stepper, Step, StepLabel, Button, Typography, Link } from '@material-ui/core'

import AccountInfoForm from './AccountInfoForm.jsx'
import PasswordForm from './PasswordForm.jsx'
import PrivacyConsentForm from './PrivacyConsentForm.jsx'
import KarunaIcon from './KarunaIcon.jsx'

import { createAccount } from '../authHelper.js'

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  logoStyle: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
}))

// Data and function for managing current step
const steps = ['Account Information', 'Account Password', 'Privacy and Consent']
function getStepContent (step, props) {
  switch (step) {
    case 0:
      return <AccountInfoForm {...props} />
    case 1:
      return <PasswordForm {...props} />
    case 2:
      return <PrivacyConsentForm {...props} />
    default:
      throw new Error('Unknown step')
  }
}

export default function SignUpForm () {
  const classes = useStyles()

  // Subscribe to changes in the global state
  const fullName = useRecoilValue(FullNameState)
  const preferredPronouns = useRecoilValue(PreferredPronounsState)
  const preferredName = useRecoilValue(PreferredNameState)
  const email = useRecoilValue(EmailState)
  const password = useRecoilValue(PasswordState)

  // State to track progress through the steps
  const [activeStep, setActiveStep] = useState(0)
  const handleBack = () => { setActiveStep(activeStep - 1) }
  const handleNext = async () => {
    // Is this the last step?
    if (activeStep === steps.length - 1) {
      try {
        // Try to create new user
        await createAccount({ fullName, preferredName, preferredPronouns, email, password })
      } catch (err) {
        if (err?.response?.status === 429) {
          window.alert('Too many failed attempts (wait 10 seconds)')
        } else {
          const message = (err?.response?.data?.message ? err.response.data.message : 'unknown error')
          window.alert(`Error creating account. Please contact an administrator for help.\n\n(Info: ${message})`)
        }
        return
      }
    }

    // Move to next step
    setActiveStep(activeStep + 1)
  }

  // Enabling/disabling the next button
  const [nextStepEnabled, setNextStepEnabled] = useState(true)

  return (
    <div className={classes.layout}>
      <div className={classes.logoStyle}>
        <KarunaIcon />
        <Typography component="h1" variant="h5">
          {'Create a New Karuna Account'}
        </Typography>
      </div>

      <Paper className={classes.paper}>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length ?
          /* At last step */
          <React.Fragment>
            <Typography variant="h5" gutterBottom>
              {`Welcome to Karuna, ${preferredName}!`}
            </Typography>
            <Typography variant="subtitle1">
              {'Your account has been successfully created. You should now follow the '}
              <Link target="_blank" href="./instructions.html">{'instructions'}</Link>
              {' for installing the extension to start using Karuna with your team!'}
              <br />
              <br />
              {'Contact your team manager if you need further assistance.'}
            </Typography>
          </React.Fragment> :

          /* All other steps */
          <React.Fragment>
            {getStepContent(activeStep, { setNextStepEnabled })}
            <div className={classes.buttons}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} className={classes.button}>
                  {'Back'}
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
                disabled={!nextStepEnabled}
              >
                {activeStep === steps.length - 1 ? 'Create Account' : 'Next'}
              </Button>
            </div>
          </React.Fragment>}
      </Paper>
    </div>
  )
}
