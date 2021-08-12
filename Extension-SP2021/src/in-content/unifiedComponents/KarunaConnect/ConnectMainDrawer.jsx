import React, { Suspense, useState } from 'react'
import PropTypes from 'prop-types'

import { ActivityStackState } from '../data/globalState'
import { useRecoilValue } from 'recoil'

import MuiPaper from '@material-ui/core/Paper'

import { Grid, Typography } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

// The header for the panel (with activity breadcrumbs)
import PanelBreadcrumbs from './PanelBreadcrumb.jsx'

// All the activities that might be used
import { ACTIVITIES } from '../Activities/Activities.js'
import ActivityBase from '../Activities/ActivityBase.jsx'

import ConnectMainActivity from './ConnectMainActivity.jsx'
import ConnectLoginActivity from './ConnectLoginActivity.jsx'
import AffectSurveyActivity from '../Activities/AffectSurvey/AffectSurveyActivity.jsx'
import AffectSurveyActivitySkeleton from '../Activities/AffectSurvey/AffectSurveyActivitySkeleton.jsx'
import PrivacyPromptActivity from '../Activities/AffectSurvey/PrivacyPromptActivity.jsx'
import CollaborationActivity from '../Activities/CollaborationActivity.jsx'
import TimeToRespondActivity from '../Activities/TimeToRespondActivity.jsx'
import MoreUserSettingsActivity from '../Activities/MoreUserSettingsActivity.jsx'

// DEBUG: Enable this logger when needed
// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('CONNECT Main Panel', 'lime', 'black')

const useStyles = makeStyles((theme) => ({
  // Style when the panel is retracted
  panelRetracted: {
    // AIW Comment in for testing styling
    // right: '0%'
    right: `calc(0% - ${theme.spacing(14)}px)`
  },

  // Style when the panel is fully expanded
  panelExpanded: {
    // AIW Comment in for testing styling
    // right: '0%'
    right: `calc(0% - ${theme.spacing(1)}px)`
  },

  // Style when the panel is hidden
  panelHidden: {
    // AIW Comment in for testing styling
    // right: '0%'
    right: `calc(0% - ${theme.spacing(39)}px)`,
    display: 'none' // panel not accessible by tab when hidden
  },

  // Activities need to be relatively positioned to overlap with siblings
  activityStyle: {
    position: 'relative'
  }
}))

const Paper = withStyles((theme) => ({
  root: {
    // display: 'flex',
    position: 'absolute',
    top: '20vh',
    width: theme.spacing(36),
    // AIW Placeholder styling for testing - I've not calculated this dimension yet.
    // maxHeight: theme.spacing(78),

    // SFB Trying out an alternative to maxHeight
    maxHeight: '65vh',
    overflowY: 'auto',
    overflowX: 'hidden',

    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(1),
    zIndex: 300,

    // Animate changes in the 'right' property
    transition: theme.transitions.create(
      ['right'], { duration: theme.transitions.duration.standard }
    )
  }
}))(MuiPaper)

/**
 * The main drawer/side-sheet for the connect panel showing info about
 * the current user's status, their team's status, and more with
 * functionality to update the current user's status.
 *
 * @param {object} props Properties for the component (See propTypes)
 * @returns {React.Element} The element to render for this component
 */
export default function ConnectMainDrawer (props) {
  const { hidden, onHide, waitToHide } = props

  // Deconstruct props and style class names
  const {
    panelHidden,
    panelRetracted,
    panelExpanded,
    activityStyle
  } = useStyles()

  // Global activity state
  const activityStack = useRecoilValue(ActivityStackState)

  // Hover state of mouse
  const [mouseIsOver, setMouseIsOver] = useState(false)

  // Handle to the pending hide request (if any)
  const [hideTimeout, setHideTimeout] = useState(false)

  // Handle to the pending retract request (if any)
  const [retractTimeout, setRetractTimeout] = useState(false)
  const [isRetracted, setIsRetracted] = useState(false)

  // Function for queueing a hide request
  const hide = (immediate) => {
    if (onHide && !hidden) {
      if (immediate) {
        onHide()
      } else {
        const timeoutHandle = setTimeout(() => { onHide() }, waitToHide)
        setHideTimeout(timeoutHandle)
      }
    }
  }

  // Function for canceling a pending hide request
  const cancelHide = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      setHideTimeout(false)
    }
  }

  // Function for queueing a retract request
  const retract = (immediate) => {
    if (!isRetracted) {
      if (immediate) {
        setIsRetracted(true)
      } else {
        const timeoutHandle = setTimeout(() => { setIsRetracted(true) }, waitToHide / 2)
        setRetractTimeout(timeoutHandle)
      }
    }
  }

  // Function for canceling a pending retract request
  const cancelRetract = () => {
    if (retractTimeout) {
      clearTimeout(retractTimeout)
      setRetractTimeout(false)
      setIsRetracted(false)
    }
  }

  // Build array of activities
  const activityElements = []
  if (activityStack.includes(ACTIVITIES.LOGIN.key)) {
    activityElements.push(
      <ConnectLoginActivity key={ACTIVITIES.LOGIN.key} className={activityStyle} />
    )
  }

  if (activityStack.includes(ACTIVITIES.MAIN.key)) {
    activityElements.push(
      <ConnectMainActivity key={ACTIVITIES.MAIN.key} hidden={hidden} retracted={!mouseIsOver} className={activityStyle} />
    )
  }

  activityElements.push(
    <ActivityBase key={ACTIVITIES.AFFECT_SURVEY.key} direction="left" in={activityStack.includes(ACTIVITIES.AFFECT_SURVEY.key)} mountOnEnter unmountOnExit>
      <Typography variant="body1">{'How are you feeling about the project?'}</Typography>
      <Suspense fallback={<AffectSurveyActivitySkeleton />}>
        <AffectSurveyActivity />
      </Suspense>
    </ActivityBase>
  )

  activityElements.push(
    <ActivityBase key={ACTIVITIES.PRIVACY_PROMPT.key} direction="left" in={activityStack.includes(ACTIVITIES.PRIVACY_PROMPT.key)} mountOnEnter unmountOnExit>
      <PrivacyPromptActivity className={activityStyle} />
    </ActivityBase>
  )

  activityElements.push(
    <ActivityBase key={ACTIVITIES.COLLABORATION_SURVEY.key} direction="left" in={activityStack.includes(ACTIVITIES.COLLABORATION_SURVEY.key)} mountOnEnter unmountOnExit>
      <CollaborationActivity />
    </ActivityBase>
  )

  activityElements.push(
    <ActivityBase key={ACTIVITIES.TIME_TO_RESPOND_SURVEY.key} direction="left" in={activityStack.includes(ACTIVITIES.TIME_TO_RESPOND_SURVEY.key)} mountOnEnter unmountOnExit>
      <TimeToRespondActivity />
    </ActivityBase>
  )

  activityElements.push(
    <ActivityBase key={ACTIVITIES.MORE_USER_SETTINGS.key} direction="left" in={activityStack.includes(ACTIVITIES.MORE_USER_SETTINGS.key)} mountOnEnter unmountOnExit>
      <MoreUserSettingsActivity />
    </ActivityBase>
  )

  // Return the proper MUI elements
  return (
    <Paper
      role={'complementary'}
      aria-label={'Main Drawer'}
      elevation={5}
      className={`${hidden ? panelHidden : (mouseIsOver ? panelExpanded : (isRetracted ? panelRetracted : panelExpanded))}`}
      onMouseEnter={() => { setMouseIsOver(true); cancelHide(); cancelRetract() }}
      onMouseLeave={() => { setMouseIsOver(false); hide(false); retract(false) }}
    >
      <Grid container>
        {/* Heading with title and breadcrumbs for activities */}
        <PanelBreadcrumbs onClose={() => { hide(true) }} />

        {/* Render the loaded activities */}
        {activityElements}
      </Grid>
    </Paper>
  )
}

ConnectMainDrawer.propTypes = {
  /** Is the panel hidden */
  hidden: PropTypes.bool,

  /** Callback function when the panel should be hidden */
  onHide: PropTypes.func,

  /** Milliseconds to wait before hiding the panel */
  waitToHide: PropTypes.number
}

ConnectMainDrawer.defaultProps = {
  hidden: false,
  onHide: null,
  // waitToHide: 3000
  // AIW Testing styles
  waitToHide: 100000
}
