import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { IconButton, Paper } from '@material-ui/core'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    backgroundColor: '#7db2f0',
    width: '50px',
    position: 'absolute',
    right: '0px'
  },

  // Image has a screwy center
  imageRoot: {
    marginLeft: '-20px',
    marginRight: '-15px',
    marginTop: '5px',
    marginBottom: '-5px'
  },

  // Icon sizing
  iconRoot: {
    width: '24px',
    height: '24px'
  }
}))

export default function ConnectPanelButton (props) {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paperRoot}>
      <IconButton onClick={() => { props.onClick() }}>
        <img src={ConnectPanelButton.KARUNA_IMG} className={classes.imageRoot} />
        <KeyboardArrowLeftIcon className={classes.iconRoot} />
      </IconButton>
    </Paper>
  )
}

ConnectPanelButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

ConnectPanelButton.KARUNA_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACVUlEQVRoge2Xz6sSURTHP5paaQoVBS7aJZQWLfoPImhTuxKKgqDEQQUJZErsvVYGpbso40mreLRo0aagoGX9B4+hltWiH/RE+yWZaZz0kQwTeXvO8Kj7gbu4517POV/nzrln0Gg0Gs1/jc8t8clkMgMsTJiulMvlC8PhEL/fL+uEw2H6/T7pdPoIYAJ+4IZlWYvTxnFTwEtgx4TpC7Azn8+/DoVCxOPxn0bTNA8B94HAeN8ny7Ki08bxzzzzX8Rs8xCweWXS6XQk+T3A4kTywjeVIG4K+G6bD2XI8QkEAlSr1e3AXWCrbV9IJYibAhyRM1+r1daP//ldDnueqvjzWsDKU7kOHHRYfwacUnHopQA5Qh8bjcY54IzD+nvgWCaTeafi1EsBUoUMoOawJuJOG4axJO+ICgGl3atDSuO8g4cBMGcYxgOfz4eMtSpg3W/sT+r1+uVgMMhgMFB26vU74MT+UqmUFvvfPAEvBXwAbjvYI8CtYrG4r9vtIkMFLwVsAC6OS6idTcCdcrm8TdoMFdzshZaBLRMmaRF2Ay+AR8ABh589Bg5blvV12jheX2ShXC7XB44Dzx3W5XK7puLQ81ZC6nw+n5fL6iiw7LDlhJK/2aX2R9++UaEZndpsNrsEnHToPnurCTJL7IlJGf0snai8qLFYTNrph0DRtm/jWhGwYJvfA15FIhGi0SiJRIJUKkWz2WwA54E3wFugrhLETQGX5KQAN8cJni0UCoN2u02r1aLXG50U+cSsVCpXgb0yTNOcczEnjUaj0Wg0Go1Go9Fo/g2AHwSljzPboCUWAAAAAElFTkSuQmCC'
