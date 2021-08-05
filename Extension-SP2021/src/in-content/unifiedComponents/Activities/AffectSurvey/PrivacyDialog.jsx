import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, FormGroup, FormControlLabel, Link, Checkbox } from '@material-ui/core'
import { OpenInBrowser } from '@material-ui/icons/'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  PrivacyPrefsState,
  PrivacyPrefsStateSetter,
  UserAffectIDState,
  LastSelectedAffectIDState
} from '../../data/globalState.js'

import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('CONNECT Privacy Dialog', 'yellow', 'black')

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'gray'
  },
  body: {
    color: '#4fa6ff',
    textAlign: 'center',
    cursor: 'pointer'
  }
}))

function PrivacyDialog (props) {
  const classes = useStyles()
  const { onClose, onCancel } = props

  // GLOBAL STATES
  const setPrivacy = useSetRecoilState(PrivacyPrefsStateSetter)
  const setCurrentAffect = useSetRecoilState(UserAffectIDState)
  const selectedAffectID = useRecoilValue(LastSelectedAffectIDState)
  const privacy = useRecoilValue(PrivacyPrefsState)

  // should probably be a global state from the database since the user probably wants this to be remembered
  const [promptState, setPromptState] = useState(privacy.prompt)

  const update = (newPrivacy) => {
    setCurrentAffect(selectedAffectID)
    setPrivacy(newPrivacy)
  }

  const onDialogClose = (canceled, newPrivacy) => {
    if (!canceled) {
      update(newPrivacy)
    } else if (onCancel) {
      onCancel()
    }
    onClose()
  }

  const handleClose = (event, reason) => {
    LOG('Dialog Close:', reason)
    if (onDialogClose) {
      onDialogClose(
        (reason !== 'public' && reason !== 'private'),
        {
          private: reason !== 'public',
          prompt: promptState
        }
      )
    }
  }

  const handlePromptChange = (event) => {
    setPromptState(event.currentTarget.checked)
  }

  return (
    <Grid container spacing={1}>
      <Grid item className={classes.title}>
        <Typography>
          {'Do you want to share your response with your team?'}
        </Typography>
      </Grid>
      <Grid item className={classes.body}>
        <FormGroup row>
          <Grid container>
            <Grid item xs={4}>
              <Typography variant={'body2'} onClick={(event) => { handleClose(event, 'private') }}>
                {'No, Keep Private'}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant={'body2'} onClick={(event) => { handleClose(event, 'public') }}>
                {'Yes, Share'}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant={'body2'} onClick={(event) => { handleClose(event, 'canceled') }}>
                {'Cancel'}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Link>
                <Typography variant={'caption'}>
                  {'Why share?'}
                  <OpenInBrowser fontSize={'small'} />
                </Typography>

              </Link>
            </Grid>
            <Grid item xs={4}>
              <Link>
                <Typography variant={'caption'}>
                  {'Is this'}
                  <OpenInBrowser fontSize={'small'} />
                  <br />
                  {'secure?'}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={12} >
              <br />
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={promptState} onChange={handlePromptChange} name="privacyPrompt" />}
            label="Save my response and don't show this message again."
          />
        </FormGroup>
      </Grid>
    </Grid>
  )
}

PrivacyDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

PrivacyDialog.defaultProps = {
  onCancel: null
}

export default PrivacyDialog
