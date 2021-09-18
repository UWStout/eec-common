import React, { Suspense } from 'react'
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

  // Create the persistent icon and the empty base
  const icon = <PersistentBubbleIcon {...props} />
  const empty = <div>{'&nbsp;'}</div>

  // Construct the proper activity to display based on the stack
  const last = activityStack.length - 1
  const activityElements = activityStack.map((curActivity, i) => {
    switch (curActivity.key) {
      case ACTIVITIES.KARUNA_MESSAGE.key:
        return (
          <ActivityBaseBubble
            key={ACTIVITIES.KARUNA_MESSAGE.key + i}
            baseElement={i === last ? icon : empty}
            hidden={hidden || (i !== last)}
          >
            <KarunaMessageActivity message={curActivity.message} {...restProps} />
          </ActivityBaseBubble>
        )

      case ACTIVITIES.WATSON_MESSAGE.key:
        return (
          <ActivityBaseBubble
            key={ACTIVITIES.KARUNA_MESSAGE.key + i}
            baseElement={i === last ? icon : empty}
            hidden={hidden || (i !== last)}
          >
            <KarunaMessageActivity message={curActivity.message} isWatson {...restProps} />
          </ActivityBaseBubble>
        )

      case ACTIVITIES.AFFECT_SURVEY.key:
        return (
          <ActivityBaseBubble
            key={ACTIVITIES.AFFECT_SURVEY.key}
            baseElement={i === last ? icon : empty}
            hidden={hidden || (i !== last)}
          >
            <AffectSurveyBubbleActivity {...restProps} />
          </ActivityBaseBubble>
        )

      case ACTIVITIES.PRIVACY_PROMPT.key:
        return (
          <ActivityBaseBubble
            key={ACTIVITIES.PRIVACY_PROMPT.key}
            baseElement={i === last ? icon : empty}
            hidden={hidden || (i !== last)}
          >
            <PrivacyPromptBubbleActivity {...restProps} />
          </ActivityBaseBubble>
        )

      case ACTIVITIES.BLANK_MESSAGE.key:
      default:
        return (
          <ActivityBaseBubble
            key={ACTIVITIES.BLANK_MESSAGE.key}
            baseElement={i === last ? icon : empty}
            hidden={hidden || (i !== last)}
          >
            <BlankActivity {...restProps} />
          </ActivityBaseBubble>
        )
    }
  })

  // Return whatever the active activity element is
  return (
    activityElements
  )
}

BubbleActivityDialog.propTypes = {
  hidden: PropTypes.bool.isRequired,
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func
}
