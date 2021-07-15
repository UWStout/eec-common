import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { UserStatusState } from '../data/globalState.js'
import { useRecoilValue } from 'recoil'

import { Paper, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import CustomTooltip from './CustomTooltip.jsx'

import { AffectObjectShape } from '../data/dataTypeShapes.js'

import OpenArrow from './PanelOpenArrow.jsx'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'absolute',
    top: '20vh',
    height: '83.18px',
    width: '64px',
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
  },

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

/**
 * A small drawer/side-sheet with an arrow that expands when hovered to show the user's status.
 * Will transition to the main panel when clicked.
 *
 * @param {object} props Properties for the component (See propTypes)
 * @returns {React.Element} The element to render for this component
 */
export default function ConnectStatusDrawer (props) {
  // Deconstruct props and style class names
  const { hidden, onHide, affect } = props
  const { root, gridContRoot, panelRetracted, panelExpanded, panelHidden } = useStyles()

  // Subscribe to changes in current status (GLOBAL STATE)
  const currentStatus = useRecoilValue(UserStatusState)

  // Is the mouse over this component
  const [mouseIsOver, setMouseIsOver] = useState(false)

  // Function to run when the component is clicked
  const clickCallback = () => {
    setMouseIsOver(false)
    if (onHide) { onHide() }
  }

  // Return the proper MUI elements
  return (
    <Paper
      data-testid="connectStatusPanel"
      elevation={3}
      className={`${root} ${hidden ? panelHidden : (mouseIsOver ? panelExpanded : panelRetracted)}`}
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
            <CustomTooltip placement='left' title={affect ? affect.name : 'none'}>
              <Typography variant='body1' align='center' gutterBottom='true'>{affect ? affect.characterCodes[0] : '?'}</Typography>
            </CustomTooltip>
          </Grid>
          <Grid item xs={12}>
            <CustomTooltip placement='left' title={currentStatus ? (currentStatus.collaboration ? 'teamwork' : 'solo') : 'unknown'}>
              <Typography variant='body1'>{currentStatus ? (currentStatus.collaboration ? '👫' : '🧍') : '?'}</Typography>
            </CustomTooltip>
          </Grid>
          <Grid item xs={12}>
            <CustomTooltip placement='left' title={currentStatus?.timeToRespond > 0 ? `${currentStatus.timeToRespond} mins` : '? mins'}>
              <Typography variant='body1'>🕐</Typography>
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

  affect: PropTypes.shape(AffectObjectShape),

  /** Callback function when the panel should be hidden */
  onHide: PropTypes.func
}

ConnectStatusDrawer.defaultProps = {
  hidden: false,
  onHide: null,
  affect: null
}
