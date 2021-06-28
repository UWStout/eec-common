import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  Dialog, DialogContent, DialogContentText,
  FormGroup, FormControlLabel, Button, Checkbox
} from '@material-ui/core'

import { PrivacyObjectShape } from './dataTypeShapes'

export default function PrivacyDialog (props) {
  const { privacy, isOpen, onDialogClose } = props
  const [promptState, setPromptState] = useState(privacy.prompt)

  const handleClose = () => {
    if (onDialogClose) { onDialogClose() }
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
          <Button autoFocus onClick={handleClose} color="primary">
            {'No, Keep Private'}
          </Button>
          <Button onClick={handleClose} color="primary">
            {'Yes, Share'}
          </Button>
        </FormGroup>
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={promptState} onChange={handlePromptChange} name="privacyPrompt" />}
            label="Do you want to share your response with your team?"
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
