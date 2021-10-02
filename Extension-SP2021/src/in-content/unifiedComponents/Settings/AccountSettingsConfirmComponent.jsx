/* eslint-disable react/jsx-indent */
import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Button } from '@material-ui/core'

import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('Account Settings Confirm Component', 'yellow', 'black')

const useStyles = makeStyles((theme) => ({
  gridBoxStyle: {
    paddingLeft: `${theme.spacing(2)}px !important`
  }
}))

export default function AccountSettingsConfirmComponent (props) {
  const { closeCallback } = props
  const { gridBoxStyle } = useStyles()

  // Respond to the dialog closing
  const onDialogClose = () => {
    if (closeCallback) { closeCallback() }
  }

  return (
    <Grid container item spacing={3}>
      <Grid item xs={12}>
        <Typography variant="body1">
          {'Your account changes were saved.'}
        </Typography>
      </Grid>

      <Grid container item xs={12} spacing={1}>
        <Grid item className={gridBoxStyle} xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={onDialogClose}
          >
            {'Ok'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

AccountSettingsConfirmComponent.propTypes = {
  closeCallback: PropTypes.func
}

AccountSettingsConfirmComponent.defaultProps = {
  closeCallback: null
}
