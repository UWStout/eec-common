import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { UserStatusState } from '../data/globalSate/userState.js'
import { AffectListState } from '../data/globalSate/teamState.js'

import { MoreVert } from '@material-ui/icons'

import { Grid, Typography, Paper as MuiPaper } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

import CollaborationIcon from '../Shared/CollaborationIcon.jsx'
import OpenArrow from './PanelOpenArrow.jsx'
import TimeToRespondIcon from '../Shared/TimeToRespondIcon.jsx'

// Lazy load affect icon
const AffectIcon = React.lazy(() => import('../Shared/AffectIcon.jsx'))

const useStyles = makeStyles((theme) => ({
  // Style when the panel is fully retracted
  panelRetracted: {
    right: `calc(0% - ${theme.spacing(7)}px)` // default is 6 (SFB: 7 to hide TTR badge)
  },

  // Style when the panel is fully expanded
  panelExpanded: {
    right: `calc(0% - ${theme.spacing(1)}px)` // default is 1
  },

  // Style when the panel is hidden
  panelHidden: {
    right: `calc(0% - ${theme.spacing(1)}px)`, // default is 11
    display: 'none' // SFB: need to delay this until animation finishes or it immediately disappears
  },

  // Styling of Grid container
  gridContRoot: {
    flexGrow: 1
  }
}))

const Paper = withStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'absolute',
    top: '20vh',
    width: theme.spacing(11),
    height: theme.spacing(13),
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    zIndex: 200,

    // Animate changes in the 'right' property
    transition: theme.transitions.create(
      ['right'], { duration: theme.transitions.duration.standard }
    ),

    // Show a pointer hand cursor to encourage clicking
    cursor: 'pointer'
  }
}))(MuiPaper)

/**
 * A small drawer/side-sheet with an arrow that expands when hovered to show the user's status.
 * Will transition to the main panel when clicked.
 *
 * @param {object} props Properties for the component (See propTypes)
 * @returns {React.Element} The element to render for this component
 */
export default function ConnectStatusDrawer (props) {
  // Deconstruct props and style class names
  const { hidden, onHide } = props
  const { gridContRoot, panelRetracted, panelExpanded, panelHidden } = useStyles()

  // Subscribe to changes in current status (GLOBAL STATE)
  const currentStatus = useRecoilValue(UserStatusState)
  const emojiList = useRecoilValue(AffectListState)

  // Is the mouse over this component
  const [mouseIsOver, setMouseIsOver] = useState(false)

  // Lookup current affect object from its ID
  const currentAffect = emojiList.find((item) => {
    return item._id === currentStatus?.currentAffectID
  })

  // Function to run when the component is clicked
  const clickCallback = () => {
    setMouseIsOver(false)
    if (onHide) { onHide() }
  }

  // Return the proper MUI elements
  return (
    <Paper
      role={'complementary'}
      aria-label={'Status Drawer'}
      elevation={3}
      className={`${hidden ? panelHidden : (mouseIsOver ? panelExpanded : panelRetracted)}`}
      onMouseEnter={() => { setMouseIsOver(true) }}
      onMouseLeave={() => { setMouseIsOver(false) }}
      onClick={clickCallback}
    >
      <Grid
        container
        className={gridContRoot}
        direction='column'
        justifyContent='center'
        spacing={2}
        role={'status'}
        id={'karunaStatusDrawer'}
      >
        <Grid
          item
          container
          xs={6}
          justifyContent='center'
        >
          <Grid item xs={12}>
            <OpenArrow showDouble={mouseIsOver} flipped OpenIcon={MoreVert} />
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="column"
          wrap="nowrap"
          xs={6}
        >
          <Grid item xs={12}>
            {currentAffect &&
              <AffectIcon placement='left' affectObj={currentAffect} privacy={currentStatus.currentAffectPrivacy} />}
            {!currentAffect &&
              <Typography variant="body1">{'?'}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <CollaborationIcon collaboration={currentStatus?.collaboration} placement='left' />
          </Grid>
          <Grid item xs={12}>
            <TimeToRespondIcon timeToRespond={currentStatus?.timeToRespond} flipped placement='left' />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

ConnectStatusDrawer.propTypes = {
  /** Is the panel hidden */
  hidden: PropTypes.bool,

  /** Callback function when the panel should be hidden */
  onHide: PropTypes.func
}

ConnectStatusDrawer.defaultProps = {
  hidden: false,
  onHide: null
}
