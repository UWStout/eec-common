import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { UserStatusState, AffectListState } from '../data/globalState.js'
import { useRecoilValue } from 'recoil'

import MuiPaper from '@material-ui/core/Paper'

import { Grid, Typography } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

import CustomTooltip from './CustomTooltip.jsx'

import OpenArrow from './PanelOpenArrow.jsx'

const useStyles = makeStyles((theme) => ({
  // Style when the panel is fully retracted
  panelRetracted: {
    right: 'calc(0% - 48px)'
  },

  // Style when the panel is fully expanded
  panelExpanded: {
    right: 'calc(0% - 8px)'
  },

  // Style when the panel is hidden
  panelHidden: {
    right: 'calc(0% - 88px)'
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
      data-testid="connectStatusDrawer"
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
        justify='center'
        spacing={2}
      >
        <Grid
          item
          container
          xs={6}
          justify='center'
        >
          <Grid item xs={12}>
            <OpenArrow showDouble={mouseIsOver} flipped />
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
            <CustomTooltip placement='left' title={currentAffect ? currentAffect.name : 'none'}>
              <Typography variant='body1' align='center' gutterBottom>{currentAffect ? currentAffect.characterCodes[0] : '?'}</Typography>
            </CustomTooltip>
          </Grid>
          <Grid item xs={12}>
            <CustomTooltip placement='left' title={currentStatus ? (currentStatus.collaboration ? 'teamwork' : 'solo') : 'unknown'}>
              <Typography variant='body1' align='center' gutterBottom>{currentStatus ? (currentStatus.collaboration ? '👫' : '🧍') : '?'}</Typography>
            </CustomTooltip>
          </Grid>
          <Grid item xs={12}>
            <CustomTooltip placement='left' title={currentStatus?.timeToRespond > 0 ? `${currentStatus.timeToRespond} mins` : '? mins'}>
              <Typography variant='body1' align='center'>🕐</Typography>
            </CustomTooltip>
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
