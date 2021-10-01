import React from 'react'
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

    case ACTIVITIES.BLANK_MESSAGE.key: {
      return (
        <BlankActivity key={key} {...restProps} />
      )
    }

    // Multi-activities must be inside their own base and can't be nested
    case ACTIVITIES.MULTI_ACTIVITY.key: {
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
  const { hidden, ...restProps } = props
  const { emptyBaseStyle } = useStyles()

  // Global activity and input disabled state
  const activityStack = useRecoilValue(BubbleActivityStackState)

  // Create the persistent icon and the empty base
  const icon = <PersistentBubbleIcon {...props} />
  const empty = <div className={emptyBaseStyle}>{'  '}</div>

  // Construct the proper activity to display based on the stack
  const last = activityStack.length - 1
  const activityElements = activityStack.map((curActivity, i) => {
    if (curActivity.key === ACTIVITIES.MULTI_ACTIVITY.key) {
      const subActivities = curActivity.message.activityList.map(
        (activityKey) => (ACTIVITIES[activityKey])
      )
      return (
        <MultiStageActivityBase
          key={ACTIVITIES.MULTI_ACTIVITY.key + i}
          activityList={subActivities}
          baseElement={i === last ? icon : empty}
          hidden={hidden || (i !== last)}
        >
          {subActivities.map((curSubActivity) => (
            buildActivity(curSubActivity, `multi-${i}`, restProps)
          ))}
        </MultiStageActivityBase>
      )
    }
    return (
      <ActivityBaseBubble
        key={curActivity.key}
        activity={ACTIVITIES.KARUNA_MESSAGE}
        baseElement={i === last ? icon : empty}
        hidden={hidden || (i !== last)}
      >
        {buildActivity(curActivity, i, restProps)}
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
