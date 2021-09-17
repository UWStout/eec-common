import React from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { BubbleActivityStackState } from '../data/globalSate/bubbleActivityState.js'

import MuiTooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'

// All the activities that might be used
import { ACTIVITIES } from './Activities/Activities.js'
// import ActivityBase from './Activities/ActivityBase.jsx'

import AffectSurveySkeleton from '../AffectSurvey/AffectSurveySkeleton.jsx'

import BlankActivity from './Activities/AffectSurveyBubbleActivity.jsx'
import PrivacyPromptBubbleActivity from './Activities/PrivacyPromptBubbleActivity.jsx'
import KarunaMessageActivity from './Activities/KarunaMessageActivity.jsx'

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
    padding: theme.spacing(2)
  }
}))(MuiTooltip)

export default function BubbleActivityDialog (props) {
  // Deconstruct the props
  const { children, offset, hidden, ...restProps } = props

  // Customization of the popper for our crazy setup
  const newPopperProps = {
    disablePortal: true,
    modifiers: {
      offset: { offset },
      flip: { enabled: false }
    }
  }

  // Global activity and input disabled state
  const activityStack = useRecoilValue(BubbleActivityStackState)
  const topActivity = (
    Array.isArray(activityStack) && activityStack.length >= 1
      ? activityStack[activityStack.length - 1]
      : null
  )

  // Construct the proper activity to display based on the stack
  let activityElement = null
  switch (topActivity) {
    case ACTIVITIES.KARUNA_MESSAGE.key:
      activityElement = <KarunaMessageActivity {...restProps} />
      break

    case ACTIVITIES.AFFECT_SURVEY.key:
      activityElement = (
        <AffectSurveySkeleton>
          <BlankActivity {...restProps} />
        </AffectSurveySkeleton>
      )
      break

    case ACTIVITIES.PRIVACY_PROMPT.key:
      activityElement = <PrivacyPromptBubbleActivity {...restProps} />
      break

    case ACTIVITIES.BLANK_MESSAGE.key:
    default:
      activityElement = <BlankActivity {...restProps} />
      break
  }

  return (
    <Tooltip
      interactive
      placement='top-end'
      open={!hidden && children !== null && activityElement !== null}
      title={activityElement}
      PopperProps={newPopperProps}
      arrow
    >
      {children}
    </Tooltip>
  )
}

BubbleActivityDialog.propTypes = {
  hidden: PropTypes.bool.isRequired,
  children: PropTypes.node,
  offset: PropTypes.string
}

BubbleActivityDialog.defaultProps = {
  children: null,
  offset: '-16, -25'
}
