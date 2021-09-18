import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState, useRecoilState } from 'recoil'
import { PushBubbleActivityState, PopBubbleActivityState } from '../../data/globalSate/bubbleActivityState.js'
import { UserAffectIDState } from '../../data/globalSate/userState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import AffectSurveyComponent from '../../AffectSurvey/AffectSurveyComponent.jsx'

import { ACTIVITIES } from './Activities.js'
import AffectSurveySkeleton from '../../AffectSurvey/AffectSurveySkeleton.jsx'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Affect Survey Activity', 'pink', 'black')

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: theme.spacing(63),
    maxHeight: theme.spacing(63),
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
  const { requestHide, cancelHide } = props
  const { container, title } = useStyles()

  // Values and mutator functions for global state (GLOBAL STATE)
  const setUserAffectID = useSetRecoilState(UserAffectIDState)

  // Global activity management
  const [currentActivity, pushActivity] = useRecoilState(PushBubbleActivityState)
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
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func
}

AffectSurveyBubbleActivity.defaultProps = {
  requestHide: null,
  cancelHide: null
}

export default AffectSurveyBubbleActivity
