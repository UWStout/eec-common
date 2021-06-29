import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  Dialog, DialogContent, DialogContentText, Grid,
  FormGroup, FormControlLabel, Link, Button, Checkbox
} from '@material-ui/core'

import { OpenInBrowser } from '@material-ui/icons/'

import { PrivacyObjectShape } from './dataTypeShapes'

import { makeLogger } from '../../util/Logger.js'
const LOG = makeLogger('CONNECT Privacy Dialog', 'yellow', 'black')

export default function PrivacyDialog (props) {
  const { privacy, isOpen, onDialogClose } = props
  const [promptState, setPromptState] = useState(privacy.prompt)

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
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogContent>
        <DialogContentText>
          {'Do you want to share your response with your team?'}
        </DialogContentText>
        <FormGroup row>
          <Grid container>
            <Grid item xs={6}>
              <Button autoFocus onClick={(event) => { handleClose(event, 'private') }} color="primary">
                {'No, Keep Private'}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button onClick={(event) => { handleClose(event, 'public') }} color="primary">
                {'Yes, Share'}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Link>
                {'Why share?'}
                <OpenInBrowser />
              </Link>
            </Grid>
            <Grid item xs={6}>
              <Link>
                {'Is this secure?'}
                <OpenInBrowser />
              </Link>
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={promptState} onChange={handlePromptChange} name="privacyPrompt" />}
            label="Save my response and don't show this message again."
          />
        </FormGroup>
      </DialogContent>
    </Dialog>
  )
}

PrivacyDialog.propTypes = {
  isOpen: PropTypes.bool,
  onDialogClose: PropTypes.func,
  privacy: PropTypes.shape(PrivacyObjectShape).isRequired
}

PrivacyDialog.defaultProps = {
  isOpen: false,
  onDialogClose: null
}
