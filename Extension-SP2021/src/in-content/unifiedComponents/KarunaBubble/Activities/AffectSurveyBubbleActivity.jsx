import React, { Suspense, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState, useRecoilState } from 'recoil'
import { PushBubbleActivityState, PopBubbleActivityState } from '../../data/globalSate/bubbleActivityState.js'
import { UserAffectInfoState } from '../../data/globalSate/userState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import AffectSurveyComponent from '../../AffectSurvey/AffectSurveyComponent.jsx'

import { ACTIVITIES } from './Activities.js'
import AffectSurveySkeleton from '../../AffectSurvey/AffectSurveySkeleton.jsx'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Affect Survey Activity', 'pink', 'black')

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: theme.spacing(70),
    maxHeight: theme.spacing(70),
    overflowY: 'hidden',
    overflowX: 'hidden'
  },
  title: {
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid lightgrey'
  }
}))

/**
 * Manage the affect survey when shown in the bubble
 **/
const AffectSurveyBubbleActivity = React.forwardRef((props, ref) => {
  const { requestHide, cancelHide, allowNext, isOnboarding } = props
  const { container, title } = useStyles()

  // Values and mutator functions for global state (GLOBAL STATE)
  const setAffectInfo = useSetRecoilState(UserAffectInfoState)

  // Global activity management
  const [currentActivity, pushActivity] = useRecoilState(PushBubbleActivityState)
  const popActivity = useSetRecoilState(PopBubbleActivityState)

  // Turn off next button until a selection is made
  useEffect(() => {
    if (isOnboarding && allowNext) { allowNext(false) }
  }, [allowNext, isOnboarding])

  // Called when the user clicks on an affect. May:
  // - Show the privacy preferences prompt
  // - Fully commit and update mood
  const onSelection = (affect, karunaSettings) => {
    if (isOnboarding) {
      setAffectInfo({
        affectID: affect?._id,
        affectPrivacy: !karunaSettings.alwaysShare
      })
      if (allowNext) { allowNext(true) }
    } else {
      if (karunaSettings.enablePrivacyPrompt) {
        pushActivity(ACTIVITIES.PRIVACY_PROMPT)
      } else {
        setAffectInfo({
          affectID: affect?._id,
          affectPrivacy: !karunaSettings.alwaysShare
        })
        popActivity(ACTIVITIES.AFFECT_SURVEY)
      }
    }
  }

  // Show affect survey
  return (
    <div onMouseOver={cancelHide} onMouseLeave={() => requestHide && requestHide(false)} className={container}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant={'body1'} className={title}>
            {currentActivity?.message?.content
              ? currentActivity?.message?.content
              : 'Which option best describes how you\'re feeling?'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Suspense fallback={<AffectSurveySkeleton />}>
            <AffectSurveyComponent noInteraction={false} selectionCallback={onSelection} ref={ref} />
          </Suspense>
        </Grid>
      </Grid>
    </div>
  )
})

AffectSurveyBubbleActivity.displayName = 'AffectSurveyBubbleActivity'

AffectSurveyBubbleActivity.propTypes = {
  isOnboarding: PropTypes.bool,
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func,
  allowNext: PropTypes.func
}

AffectSurveyBubbleActivity.defaultProps = {
  isOnboarding: false,
  requestHide: null,
  cancelHide: null,
  allowNext: null
}

export default AffectSurveyBubbleActivity
