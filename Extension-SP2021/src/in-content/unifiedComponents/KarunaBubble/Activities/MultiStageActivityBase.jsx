/* eslint-disable react/jsx-indent */
import React, { Children, useState } from 'react'
import PropTypes from 'prop-types'

import { useRecoilState } from 'recoil'
import { PopBubbleActivityState } from '../../data/globalSate/bubbleActivityState.js'

import { withStyles, makeStyles } from '@material-ui/core/styles'
import { Tooltip as MuiTooltip, Zoom, Grid, Typography, IconButton } from '@material-ui/core'
import { Close as CloseIcon, Done as DoneIcon, ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'

import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('Multi-stage Activity Base', 'pink', 'black')

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
  },
  footerBox: {
    borderTop: '1px solid grey',
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1)
  }
}))

export default function MultiStageActivityBase (props) {
  const { activityList, noClose, children, baseElement, hidden, nextEnabled, offset, requestHide, cancelHide } = props
  const { titleBox, footerBox } = useStyles()

  // Customization of the popper for our crazy setup
  const newPopperProps = {
    disablePortal: true,
    modifiers: {
      offset: { offset },
      flip: { enabled: false }
    }
  }

  // Examine children as an array
  const childrenArray = Children.toArray(children)

  // Track movement through the activities
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentActivity = activityList[currentIndex]

  // Change displayed task
  const onNext = () => {
    if (currentIndex < activityList.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const onPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  // Remove this activity when closing the bubble dialog
  const [topStackActivity, popBubbleActivity] = useRecoilState(PopBubbleActivityState)
  const onClose = () => {
    if (cancelHide) { cancelHide() }
    popBubbleActivity(topStackActivity)
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
              <Typography variant="button">{currentActivity.title}</Typography>
              {!noClose &&
                <MuiTooltip title={'Dismiss message'} placement="top-end" PopperProps={{ disablePortal: true }}>
                  <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                  </IconButton>
                </MuiTooltip>}
            </Grid>
            <Grid item xs={12}>
              {/* Extract the proper child element to match current index */}
              {currentIndex <= childrenArray.length
                ? childrenArray[currentIndex]
                : <Typography>{'Bad child index'}</Typography>}
            </Grid>
            <Grid item container xs={12} direction="row" justifyContent="space-between" alignItems="center" className={footerBox}>
              {/* Show previous button? */}
              <MuiTooltip title={'Previous Step'} placement="bottom-end" PopperProps={{ disablePortal: true }}>
                <div>
                  <IconButton size="small" onClick={onPrevious} disabled={currentIndex <= 0}>
                    <ArrowBackIos />
                  </IconButton>
                </div>
              </MuiTooltip>

              {/* Show 'next' or 'finished' button? */}
              {currentIndex < activityList.length - 1
                ? <MuiTooltip title={'Next Step'} placement="bottom-end" PopperProps={{ disablePortal: true }}>
                    <div>
                      <IconButton size="small" onClick={onNext} disabled={!nextEnabled}>
                        <ArrowForwardIos color={nextEnabled ? 'primary' : 'disabled'} />
                      </IconButton>
                    </div>
                  </MuiTooltip>

                : <MuiTooltip title={'Finish'} placement="bottom-end" PopperProps={{ disablePortal: true }}>
                    <div>
                      <IconButton size="small" onClick={onClose} disabled={!nextEnabled}>
                        <DoneIcon color={nextEnabled ? 'primary' : 'disabled'} />
                      </IconButton>
                    </div>
                  </MuiTooltip>}
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

MultiStageActivityBase.propTypes = {
  children: PropTypes.node.isRequired,
  baseElement: PropTypes.node.isRequired,
  activityList: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  nextEnabled: PropTypes.bool,
  noClose: PropTypes.bool,
  offset: PropTypes.string,
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func,
  hidden: PropTypes.bool
}

MultiStageActivityBase.defaultProps = {
  nextEnabled: true,
  requestHide: null,
  cancelHide: null,
  noClose: false,
  hidden: false,
  offset: '-16, -25'
}
