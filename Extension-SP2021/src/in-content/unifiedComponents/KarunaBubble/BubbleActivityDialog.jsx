import React from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { BubbleActivityStackState } from '../data/globalSate/bubbleActivityState.js'

import PersistentBubbleIcon from './PersistentBubbleIcon.jsx'

// All the activities that might be used
import { ACTIVITIES } from './Activities/Activities.js'
import ActivityBaseBubble from './Activities/ActivityBaseBubble.jsx'

import BlankActivity from './Activities/BlankActivity.jsx'
import PrivacyPromptBubbleActivity from './Activities/PrivacyPromptBubbleActivity.jsx'
import KarunaMessageActivity from './Activities/KarunaMessageActivity.jsx'
import AffectSurveyBubbleActivity from './Activities/AffectSurveyBubbleActivity.jsx'

import AffectSurveySkeleton from '../AffectSurvey/AffectSurveySkeleton.jsx'

export default function BubbleActivityDialog (props) {
  // Deconstruct the props
  const { hidden, ...restProps } = props

  // Global activity and input disabled state
  const activityStack = useRecoilValue(BubbleActivityStackState)
  const topActivity = (
    Array.isArray(activityStack) && activityStack.length >= 1
      ? activityStack[activityStack.length - 1]
      : null
  )

  // Create the persistent icon
  const icon = <PersistentBubbleIcon hidden={hidden} {...restProps} />

  // Construct the proper activity to display based on the stack
  let activityElement = null
  switch (topActivity) {
    case ACTIVITIES.KARUNA_MESSAGE.key:
      activityElement = (
        <ActivityBaseBubble baseElement={icon} hidden={hidden}>
          <KarunaMessageActivity />
        </ActivityBaseBubble>
      )
      break

    case ACTIVITIES.AFFECT_SURVEY.key:
      activityElement = (
        <ActivityBaseBubble baseElement={icon} hidden={hidden}>
          <AffectSurveySkeleton>
            <AffectSurveyBubbleActivity />
          </AffectSurveySkeleton>
        </ActivityBaseBubble>
      )
      break

    case ACTIVITIES.PRIVACY_PROMPT.key:
      activityElement = (
        <ActivityBaseBubble baseElement={icon} hidden={hidden}>
          <PrivacyPromptBubbleActivity />
        </ActivityBaseBubble>
      )
      break

    case ACTIVITIES.BLANK_MESSAGE.key:
    default:
      activityElement = (
        <ActivityBaseBubble baseElement={icon} hidden={hidden}>
          <BlankActivity />
        </ActivityBaseBubble>
      )
      break
  }

  // Return whatever the active activity element is
  return (activityElement)
}

BubbleActivityDialog.propTypes = {
  hidden: PropTypes.bool.isRequired
}
