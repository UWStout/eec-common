import React from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { PopBubbleActivityState } from '../../data/globalSate/bubbleActivityState.js'

import { withStyles, makeStyles } from '@material-ui/core/styles'
import { Tooltip as MuiTooltip, Zoom, Grid, Typography, IconButton } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('Bubble Activity Base', 'pink', 'black')

// Create our pre-styled tooltip component
const Tooltip = withStyles((theme) => ({
  arrow: {
    fontSize: theme.spacing(2),
    '&::before': {
      border: '1px solid white'
    },
    color: theme.palette.common.white
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid white',
    color: '#4A4A4A',
    fontSize: theme.typography.body1,
    padding: theme.spacing(2),
    boxShadow: theme.shadows[2],
    zIndex: 10
  }
}))(MuiTooltip)

const useStyles = makeStyles((theme) => ({
  titleBox: {
    borderBottom: '1px solid grey',
    marginBottom: theme.spacing(2)
  }
}))

export default function ActivityBaseBubble (props) {
  const { activity, noClose, children, baseElement, hidden, offset, requestHide, cancelHide } = props
  const { titleBox } = useStyles()

  // Customization of the popper for our crazy setup
  const newPopperProps = {
    disablePortal: true,
    modifiers: {
      offset: { offset },
      flip: { enabled: false }
    }
  }

  // Remove this activity when closing the bubble dialog
  const popBubbleActivity = useSetRecoilState(PopBubbleActivityState)
  const onClose = () => {
    if (cancelHide) { cancelHide() }
    popBubbleActivity(activity)
  }

  return (
    <Tooltip
      interactive
      placement='top-end'
      TransitionComponent={Zoom}
      TransitionProps={{ appear: true }}
      open={!hidden && children !== null}
      title={
        <div onMouseOver={cancelHide} onMouseLeave={() => requestHide && requestHide(false)}>
          <Grid container>
            <Grid item container xs={12} direction="row" justifyContent="space-between" alignItems="center" className={titleBox}>
              <Typography variant="button">{activity.title}</Typography>
              {!noClose &&
                <MuiTooltip title={'Dismiss message'} placement="top-end" PopperProps={{ disablePortal: true }}>
                  <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                  </IconButton>
                </MuiTooltip>}
            </Grid>
            <Grid item xs={12}>
              {children}
            </Grid>
          </Grid>
        </div>
      }
      PopperProps={newPopperProps}
      arrow
    >
      {baseElement}
    </Tooltip>
  )
}

ActivityBaseBubble.propTypes = {
  children: PropTypes.node.isRequired,
  baseElement: PropTypes.node.isRequired,
  activity: PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  noClose: PropTypes.bool,
  offset: PropTypes.string,
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func,
  hidden: PropTypes.bool
}

ActivityBaseBubble.defaultProps = {
  requestHide: null,
  cancelHide: null,
  noClose: false,
  hidden: false,
  offset: '-16, -25'
}
