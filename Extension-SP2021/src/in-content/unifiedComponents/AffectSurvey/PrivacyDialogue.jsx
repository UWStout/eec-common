import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, FormGroup, FormControlLabel, Link, Button, Checkbox } from '@material-ui/core'
import { OpenInBrowser } from '@material-ui/icons/'

import { PrivacyObjectShape } from '../data/dataTypeShapes.js'

import { makeLogger } from '../../../util/Logger.js'
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

function PrivacyDialogue (props) {
  const classes = useStyles()
  const { privacy, onClose, onUpdate, onCancel } = props

  // should probably be a global state from the database since the user probably wants this to be remembered
  const [promptState, setPromptState] = useState(privacy.prompt)

  const onDialogueClose = (canceled, newPrivacy) => {
    if (!canceled) {
      onUpdate(newPrivacy)
    } else if (onCancel) {
      onCancel()
    }
    onClose()
  }

  const handleClose = (event, reason) => {
    LOG('Dialog Close:', reason)
    if (onDialogueClose) {
      onDialogueClose(
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

PrivacyDialogue.propTypes = {
  privacy: PropTypes.shape(PrivacyObjectShape).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

PrivacyDialogue.defaultProps = {
  onCancel: null
}

export default PrivacyDialogue
