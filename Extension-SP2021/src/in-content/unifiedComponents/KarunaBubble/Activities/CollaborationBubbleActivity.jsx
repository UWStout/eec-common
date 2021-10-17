import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { UserCollaborationState } from '../../data/globalSate/userState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Radio, RadioGroup, FormControlLabel } from '@material-ui/core'

import { rawCollaborationIcon } from '../../Shared/CollaborationIcon.jsx'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Affect Survey Activity', 'pink', 'black')

function makeCollaboration (collaboration, text, iconTweakStyle) {
  return (
    <React.Fragment>
      <span className={iconTweakStyle}>{rawCollaborationIcon(collaboration)}</span>
      {text ? ` ${text}` : ' unknown'}
    </React.Fragment>
  )
}

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid lightgrey'
  },
  iconTweakStyle: {
    position: 'relative',
    top: '0.125em',
    marginRight: theme.spacing(1)
  }
}))

/**
 * Manage the collaboration survey when shown in the bubble
 **/
const CollaborationBubbleActivity = React.forwardRef((props, ref) => {
  const { requestHide, cancelHide, allowNext } = props
  const { title, iconTweakStyle } = useStyles()

  // Values and mutator functions for global state (GLOBAL STATE)
  const setUserCollaborationState = useSetRecoilState(UserCollaborationState)

  // Local state
  const [collaboration, setCollaboration] = useState('')

  // Respond to changes in collaboration
  useEffect(() => {
    if (collaboration !== '') {
      setUserCollaborationState(collaboration)
    }

    if (allowNext) {
      allowNext(collaboration !== '')
    }
  }, [collaboration, allowNext, setUserCollaborationState])

  // Show affect survey
  return (
    <div onMouseOver={cancelHide} onMouseLeave={() => requestHide && requestHide(false)}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant={'body1'} className={title}>
            {'What is your current willingness to collaborate?'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <RadioGroup
            aria-label="willingness to collaborate"
            name="collaboration"
            value={collaboration}
            onChange={(e) => { setCollaboration(e.target.value) }}
          >
            <FormControlLabel
              value={'Open to Collaboration'}
              control={<Radio color="default" />}
              label={makeCollaboration('Open to Collaboration', 'I am open to collaborate with someone.', iconTweakStyle)}
            />
            <FormControlLabel
              value={'Currently Collaborating'}
              control={<Radio color="default" />}
              label={makeCollaboration('Currently Collaborating', 'I am already collaborating with someone.', iconTweakStyle)}
            />
            <FormControlLabel
              value={'Focused'}
              control={<Radio color="default" />}
              label={makeCollaboration('Focused', 'I am focused, and prefer not to collaborate right now.', iconTweakStyle)}
            />
          </RadioGroup>
        </Grid>
      </Grid>
    </div>
  )
})

CollaborationBubbleActivity.displayName = 'CollaborationBubbleActivity'

CollaborationBubbleActivity.propTypes = {
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func,
  allowNext: PropTypes.func
}

CollaborationBubbleActivity.defaultProps = {
  requestHide: null,
  cancelHide: null,
  allowNext: null
}

export default CollaborationBubbleActivity
