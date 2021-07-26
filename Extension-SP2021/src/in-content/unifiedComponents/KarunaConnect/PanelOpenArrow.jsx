import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'

import { KeyboardArrowRight, DoubleArrow } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  flipped: {
    transform: 'scale(-1, 1) translateY(-50%)',
    position: 'absolute',
    top: '50%'
  },
  standard: {
    transform: 'translateY(-50%)',
    position: 'absolute',
    top: '50%'
  }
}))

export default function OpenArrow (props) {
  const { showDouble, flipped } = props
  const classes = useStyles()

  let ariaLabel = ''
  if (showDouble && flipped) {
    ariaLabel = 'Left Double Arrow'
  } else if (showDouble) {
    ariaLabel = 'Right Double Arrow'
  } else if (flipped) {
    ariaLabel = 'Left Arrow'
  } else {
    ariaLabel = 'Right Arrow'
  }

  return (
    <div role={'button'} aria-label={ariaLabel}>
      <Fade in={showDouble}>
        <DoubleArrow className={flipped ? classes.flipped : classes.standard} />
      </Fade>
      <Fade in={!showDouble}>
        <KeyboardArrowRight className={flipped ? classes.flipped : classes.standard} />
      </Fade>
    </div>
  )
}

OpenArrow.propTypes = {
  showDouble: PropTypes.bool,
  flipped: PropTypes.bool
}

OpenArrow.defaultProps = {
  showDouble: false,
  flipped: false
}
