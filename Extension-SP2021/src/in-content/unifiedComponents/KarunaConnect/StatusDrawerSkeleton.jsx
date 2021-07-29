import React, { useState } from 'react'

import MuiPaper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { Grid } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  // Style when the panel is fully retracted
  panelRetracted: {
    right: `calc(0% - ${theme.spacing(6)}px)`
  },

  // Style when the panel is fully expanded
  panelExpanded: {
    right: `calc(0% - ${theme.spacing(1)}px)`
  },

  // Style when the panel is hidden
  panelHidden: {
    right: `calc(0% - ${theme.spacing(11)}px)`
  },

  // Styling of Grid container
  gridContRoot: {
    flexGrow: 1
  },

  // Styling for spinner placeholders
  spinner: {
    position: 'absolute',
    top: 'calc(50% - 12px)'
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
    )
  }
}))(MuiPaper)

/**
 * A small drawer/side-sheet with spinners to show the status drawer is loading.
 *
 * @param {object} props Properties for the component (See propTypes)
 * @returns {React.Element} The element to render for this component
 */
export default function ConnectStatusDrawer () {
  // Deconstruct props and style class names
  const { gridContRoot, panelRetracted, panelExpanded, panelHidden, spinner } = useStyles()

  // Is the mouse over this component
  const [mouseIsOver, setMouseIsOver] = useState(false)

  // Function to run when the component is clicked
  const clickCallback = () => {
    setMouseIsOver(false)
  }

  // Return the proper MUI elements
  return (
    <Paper
      role={'complementary'}
      aria-label={'Status Drawer'}
      elevation={3}
      className={`${(mouseIsOver ? panelExpanded : panelRetracted)}`}
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
        aria-busy={'true'}
      >
        <Grid
          item
          container
          xs={6}
          justifyContent='center'
        >
          <Grid item xs={12}>
            <CircularProgress size={'24px'} className={spinner} />
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
            <CircularProgress size={'24px'} />
          </Grid>
          <Grid item xs={12}>
            <CircularProgress size={'24px'} />
          </Grid>
          <Grid item xs={12}>
            <CircularProgress size={'24px'} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}
