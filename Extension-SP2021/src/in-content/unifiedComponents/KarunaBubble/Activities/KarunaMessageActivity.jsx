import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Typography } from '@material-ui/core'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Affect Survey Activity', 'pink', 'black')

/**
 * Default blank message when there is nothing else to show
 * (always at the bottom of the stack, should never be popped)
 **/
export default function KarunaMessageActivity (props) {
  const { requestHide, cancelHide, message } = props

  // Show affect survey
  return (
    <div onMouseEnter={cancelHide} onMouseLeave={() => requestHide && requestHide(false)}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="body1">
            {message.content}
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

KarunaMessageActivity.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired
  }).isRequired,
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func
}

KarunaMessageActivity.defaultProps = {
  requestHide: null,
  cancelHide: null
}
