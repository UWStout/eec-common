import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { BubbleActivityStackState } from '../data/globalSate/bubbleActivityState.js'

import { makeStyles } from '@material-ui/core'

import PersistentBubbleIcon from './PersistentBubbleIcon.jsx'

// All the activities that might be used
import { ACTIVITIES } from './Activities/Activities.js'
import ActivityBaseBubble from './Activities/ActivityBaseBubble.jsx'
import MultiStageActivityBase from './Activities/MultiStageActivityBase.jsx'

import BlankActivity from './Activities/BlankActivity.jsx'
import PrivacyPromptBubbleActivity from './Activities/PrivacyPromptBubbleActivity.jsx'
import KarunaMessageActivity from './Activities/KarunaMessageActivity.jsx'
import StatusMessageActivity from './Activities/StatusMessageActivity.jsx'
import AffectSurveyBubbleActivity from './Activities/AffectSurveyBubbleActivity.jsx'
import CollaborationBubbleActivity from './Activities/CollaborationBubbleActivity.jsx'
import TimeToRespondBubbleActivity from './Activities/TimeToRespondActivity.jsx'

// Colorful logger (enable if logging is needed)
import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('Bubble Activity Dialog', 'purple', 'black')

const useStyles = makeStyles((theme) => ({
  emptyBaseStyle: {
    position: 'absolute',
    bottom: '0%',
    right: '0%',
    margin: theme.spacing(1)
  }
}))

/**
 * Render the component that implements the given activity
 * NOTE: Must be called from within a component render method.
 *
 * @param {Activity} curActivity An entry from the 'ACTIVITIES' array optionally with a 'message'
 * @param {string} suffix String appended to the key of the returned component
 * @param {object} restProps Object with properties to spread onto the returned component
 * @returns {React.Component} A react component
 */
function buildActivity (curActivity, suffix = '', restProps = {}) {
  const key = `${curActivity.key}-${suffix}`
  switch (curActivity.key) {
    case ACTIVITIES.KARUNA_MESSAGE.key: {
      return (
        <KarunaMessageActivity key={key} message={curActivity.message} {...restProps} />
      )
    }

    case ACTIVITIES.STATUS_MESSAGE.key: {
      return (
        <StatusMessageActivity key={key} {...restProps} />
      )
    }

    case ACTIVITIES.WATSON_MESSAGE.key: {
      return (
        <KarunaMessageActivity key={key} message={curActivity.message} isWatson {...restProps} />
      )
    }

    case ACTIVITIES.AFFECT_SURVEY.key: {
      return (
        <AffectSurveyBubbleActivity key={key} {...restProps} />
      )
    }

    case ACTIVITIES.PRIVACY_PROMPT.key: {
      return (
        <PrivacyPromptBubbleActivity key={key} {...restProps} />
      )
    }

    case ACTIVITIES.COLLABORATION_SURVEY.key: {
      return (
        <CollaborationBubbleActivity key={key} {...restProps} />
      )
    }

    case ACTIVITIES.TIME_TO_RESPOND_SURVEY.key: {
      return (
        <TimeToRespondBubbleActivity key={key} {...restProps} />
      )
    }

    case ACTIVITIES.BLANK_MESSAGE.key: {
      return (
        <BlankActivity key={key} {...restProps} />
      )
    }

    // Multi-activities must be inside their own base and can't be nested
    case ACTIVITIES.ONBOARDING_ACTIVITY.key: {
      LOG.error('Cannot have a nested multi-activity')
      return <div key={key + '-error'}>{'error'}</div>
    }

    // Some other unexpected activity key
    default: {
      LOG.error('Unknown activity encountered:', curActivity)
      return (
        <div key={key + '-error'}>{'error'}</div>
      )
    }
  }
}

export default function BubbleActivityDialog (props) {
  // Deconstruct the props and styles
  const { hidden, requestHide, cancelHide } = props
  const { emptyBaseStyle } = useStyles()

  // Global activity and input disabled state
  const activityStack = useRecoilValue(BubbleActivityStackState)

  // Is the multi-activity next button enabled
  const [nextEnabled, setNextEnabled] = useState(true)

  // Create the persistent icon and the empty base
  const icon = <PersistentBubbleIcon {...props} />
  const empty = <div className={emptyBaseStyle}>{'  '}</div>

  // Construct the proper activity to display based on the stack
  const last = activityStack.length - 1
  const activityElements = activityStack.map((curActivity, i) => {
    if (curActivity.key === ACTIVITIES.AFFECT_SURVEY.key || curActivity.key === ACTIVITIES.ONBOARDING_ACTIVITY.key) {
      return (
        <MultiStageActivityBase
          key={curActivity.key + i}
          activityList={curActivity.message.activityList}
          baseElement={i === last ? icon : empty}
          hidden={hidden || (i !== last)}
          requestHide={requestHide}
          cancelHide={cancelHide}
          nextEnabled={nextEnabled}
        >
          {curActivity.message.activityList.map((curSubActivity) => (
            buildActivity(curSubActivity, `multi-${i}`, { requestHide, cancelHide, allowNext: setNextEnabled, isOnboarding: true })
          ))}
        </MultiStageActivityBase>
      )
    }
    return (
      <ActivityBaseBubble
        key={curActivity.key}
        activity={curActivity}
        baseElement={i === last ? icon : empty}
        hidden={hidden || (i !== last)}
        requestHide={requestHide}
        cancelHide={cancelHide}
        noClose={curActivity.key === ACTIVITIES.BLANK_MESSAGE.key}
      >
        {buildActivity(curActivity, i, { requestHide, cancelHide })}
      </ActivityBaseBubble>
    )
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
