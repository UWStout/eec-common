import React from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { PushBubbleActivityState, PopBubbleActivityState } from '../../data/globalSate/bubbleActivityState.js'
import { UserAffectIDState } from '../../data/globalSate/userState.js'

import { makeStyles } from '@material-ui/core/styles'

import AffectSurveyComponent from '../../AffectSurvey/AffectSurveyComponent.jsx'

import { ACTIVITIES } from './Activities.js'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Affect Survey Activity', 'pink', 'black')

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: theme.spacing(48),
    maxHeight: theme.spacing(48),
    overflowY: 'hidden',
    overflowX: 'hidden'
  }
}))

/**
 * Manage the affect survey when shown in the bubble
 **/
const AffectSurveyBubbleActivity = React.forwardRef((props, ref) => {
  const { requestHide, cancelHide } = props
  const { container } = useStyles()

  // Values and mutator functions for global state (GLOBAL STATE)
  const setUserAffectID = useSetRecoilState(UserAffectIDState)

  // Global activity management
  const pushActivity = useSetRecoilState(PushBubbleActivityState)
  const popActivity = useSetRecoilState(PopBubbleActivityState)

  // Called when the user clicks on an affect. May:
  // - Show the privacy preferences prompt
  // - Fully commit and update mood
  const onSelection = (affect, affectPrivacy) => {
    if (affectPrivacy.prompt) {
      pushActivity(ACTIVITIES.PRIVACY_PROMPT)
    } else {
      setUserAffectID(affect?._id)
      popActivity(ACTIVITIES.AFFECT_SURVEY)
    }
  }

  // Show affect survey
  return (
    <div onMouseEnter={cancelHide} onMouseLeave={() => requestHide && requestHide(false)} className={container}>
      <AffectSurveyComponent noInteraction={false} selectionCallback={onSelection} ref={ref} />
    </div>
  )
})

AffectSurveyBubbleActivity.displayName = 'AffectSurveyBubbleActivity'

AffectSurveyBubbleActivity.propTypes = {
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func
}

AffectSurveyBubbleActivity.defaultProps = {
  requestHide: null,
  cancelHide: null
}

export default AffectSurveyBubbleActivity
