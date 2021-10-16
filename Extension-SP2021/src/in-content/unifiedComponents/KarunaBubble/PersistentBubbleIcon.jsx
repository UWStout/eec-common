import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue, useRecoilState } from 'recoil'
import { BubbleActivityStackState } from '../data/globalSate/bubbleActivityState.js'
import { ConnectVisibilityState } from '../data/globalSate/appState.js'
import { ValidUserState } from '../data/globalSate/userState.js'

import { ACTIVITIES } from './Activities/Activities.js'

import { makeStyles } from '@material-ui/core/styles'
import { SvgIcon, IconButton } from '@material-ui/core'
import { AccountCircle, PriorityHigh, Create as CreateIcon } from '@material-ui/icons'

import { animateCSS } from '../Shared/animateHelper.js'

// Colorful logger (enable if logging is needed)
// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('Persistent Bubble Component', 'yellow', 'black')

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: '0%',
    right: '0%',
    margin: theme.spacing(1),
    '--animate-repeat': 3
  },
  accountIndicator: {
    fontSize: theme.spacing(3),
    position: 'absolute',
    right: theme.spacing(2.75),
    bottom: theme.spacing(4)
  },
  contextIndicator: {
    color: 'white',
    position: 'absolute',
    minWidth: '36px',
    right: theme.spacing(2.13),
    bottom: theme.spacing(4.75)
  },
  iconStyle: {
    fontSize: theme.spacing(7)
  },
  overlayStyle: {
    color: theme.palette.grey[900]
  }
}))

const PersistentBubbleIcon = React.forwardRef(function PersistentBubbleIcon (props, ref) {
  const { hidden, requestHide, cancelHide, setOpen } = props
  const classes = useStyles()

  // State of user login (GLOBAL STATE)
  const userLoggedIn = useRecoilValue(ValidUserState)

  // Other global state
  const activityStack = useRecoilValue(BubbleActivityStackState)
  const [mainPanelOpen, setMainPanelOpen] = useRecoilState(ConnectVisibilityState)

  // Determine what indicators to show
  const topActivityKey = activityStack[activityStack.length - 1].key
  const showPriorityIndicator = topActivityKey === ACTIVITIES.AFFECT_SURVEY.key
  const showAlertIndicator = !showPriorityIndicator && (topActivityKey !== ACTIVITIES.BLANK_MESSAGE.key)

  const clickCallback = () => {
    if (!userLoggedIn) {
      // Toggle main panel open or closed (shows login form)
      setMainPanelOpen(!mainPanelOpen)
    } else {
      if (setOpen) {
        if (cancelHide) { cancelHide() }
        setOpen(hidden)
      }
      if (!hidden) {
        if (requestHide) { requestHide(false) }
      }
    }
  }

  // Shake the icon whenever there's a new message to view
  useEffect(() => {
    // Determine what indicators to show
    const topActivityKey = activityStack[activityStack.length - 1].key
    const showPriorityIndicator = topActivityKey === ACTIVITIES.AFFECT_SURVEY.key
    const showAlertIndicator = !showPriorityIndicator && (topActivityKey !== ACTIVITIES.BLANK_MESSAGE.key && topActivityKey !== ACTIVITIES.PRIVACY_PROMPT.key)

    const ariaLabel = (userLoggedIn ? 'Open Feedback Dialog' : 'Open Login Dialog')
    if (!userLoggedIn || showPriorityIndicator) {
      animateCSS(`[aria-label="${ariaLabel}"]`, 'tada', 1)
    } else if (showAlertIndicator) {
      animateCSS(`[aria-label="${ariaLabel}"]`, 'heartBeat')
    }
  }, [activityStack.length, userLoggedIn, activityStack])

  return (
    <IconButton
      ref={ref}
      onClick={clickCallback}
      onMouseEnter={cancelHide}
      onMouseLeave={() => requestHide && requestHide(false)}
      className={classes.root}
      aria-label={userLoggedIn ? 'Open Feedback Dialog' : 'Open Login Dialog'}
    >
      <SvgIcon className={classes.iconStyle}>
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="a">
              <feGaussianBlur stdDeviation="6.923063" />
            </filter>
          </defs>
          <g fillRule="evenodd" strokeLinecap="round">
            <path d="m150.78 171.14c-64.775 1.0408-121.91 37.138-134.04 88.345-13.858 58.498 36.239 114.67 111.84 125.43 0.0159 0.090149-0.01088 0.22348-0.018066 0.3523l-0.4336 0.0185-58.909 54.787 121.03-56.864-1.1923 0.0371 0.7768-0.5933 1.7342-0.0556-1.3187 0.6118 1.662-0.0556v-0.57477h0.018066c52.372-11.537 89.089-42.795 98.904-84.229 13.863-58.522-36.296-114.72-111.95-125.44-9.4564-1.3405-18.855-1.91-28.109-1.7613z" fillOpacity=".498" filter="url(#a)" strokeWidth="2.5" />
            <path d="m167.43 150.34c-64.776 1.0408-121.91 37.138-134.04 88.345-13.858 58.498 36.239 114.67 111.84 125.43 0.0159 0.090118-0.010895 0.22348-0.018082 0.3523l-0.4335 0.0185-58.909 54.787 121.03-56.864-1.1923 0.0371 0.7768-0.5933 1.7342-0.0556-1.3187 0.6118 1.662-0.0556v-0.57477h0.018066c52.372-11.537 89.089-42.795 98.904-84.229 13.863-58.522-36.296-114.72-111.95-125.44-9.4564-1.3405-18.855-1.91-28.109-1.7613z" fill="dodgerblue" stroke="dodgerblue" strokeLinejoin="round" strokeWidth="15" />
            <path d="m282.32 39.994c81.465 1.309 153.32 46.707 168.58 111.11 17.428 73.57-45.577 144.21-140.65 157.74-0.02002 0.11334 0.013672 0.28104 0.022705 0.44302l0.5453 0.0233 74.087 68.903-152.22-71.514 1.4995 0.0466-0.9769-0.7462-2.181-0.07 1.6585 0.7695-2.0902-0.07v-0.72284h-0.02272c-65.866-14.509-112.04-53.821-124.39-105.93-17.435-73.601 45.648-144.28 140.79-157.77 11.893-1.6859 23.713-2.4022 35.351-2.2152z" fillOpacity=".498" filter="url(#a)" strokeWidth="2.5" />
            <path d="m304.09 19.957c81.465 1.309 153.32 46.707 168.58 111.11 17.428 73.57-45.577 144.21-140.65 157.74-0.019989 0.11337 0.013702 0.28107 0.022736 0.44305l0.5453 0.0233 74.087 68.903-152.22-71.514 1.4995 0.0466-0.9769-0.7462-2.181-0.0699 1.6585 0.7695-2.0902-0.0699v-0.72287h-0.02272c-65.866-14.509-112.04-53.821-124.39-105.93-17.435-73.601 45.648-144.28 140.79-157.77 11.893-1.6859 23.713-2.4022 35.351-2.2152z" fill="mediumturquoise" stroke="mediumturquoise" strokeLinejoin="round" strokeWidth="20" />
          </g>
        </svg>
      </SvgIcon>

      {!userLoggedIn &&
        <div className={classes.accountIndicator}>
          <AccountCircle className={classes.overlayStyle} />
        </div>}

      {userLoggedIn && showAlertIndicator &&
        <div className={classes.accountIndicator}>
          <CreateIcon className={classes.overlayStyle} />
        </div>}

      {userLoggedIn && showPriorityIndicator &&
        <div className={classes.accountIndicator}>
          <PriorityHigh className={classes.overlayStyle} />
        </div>}

    </IconButton>
  )
})

PersistentBubbleIcon.propTypes = {
  hidden: PropTypes.bool,
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func,
  setOpen: PropTypes.func
}

PersistentBubbleIcon.defaultProps = {
  hidden: false,
  requestHide: null,
  cancelHide: null,
  setOpen: null
}

export default PersistentBubbleIcon
