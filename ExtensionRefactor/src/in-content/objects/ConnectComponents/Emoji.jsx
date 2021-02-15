import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { SvgIcon } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  emojiSpan: {
    width: '30px',
    paddingRight: '10px',
    fontSize: '18pt',
    marginTop: '-5px',
    marginBottom: '-5px'
  },
  svgIconSpan: {
    width: '30px',
    paddingRight: '10px',
    fontSize: '18pt',
    marginBottom: '-10px'
  }
}))

/**
 *
 * @param {string} symbol The actual unicode emoji
 * @param {string} label The aria-label description of the emoji
 */
export default function Emoji (props) {
  const classes = useStyles()

  if (typeof props.symbol === 'string' || !props.symbol) {
    return (
      <span className={classes.emojiSpan} role='img' title={props.label ? props.label : ''}
        aria-label={props.label ? props.label : ''} aria-hidden={props.label ? 'false' : 'true'}>
        {props.symbol}
      </span>
    )
  } else {
    return (
      <span className={classes.svgIconSpan} role='img' title={props.label ? props.label : ''}
        aria-label={props.label ? props.label : ''} aria-hidden={props.label ? 'false' : 'true'}>
        {props.symbol}
      </span>
    )
  }
}

// Props validation
Emoji.propTypes = {
  label: PropTypes.string,
  symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(SvgIcon)]).isRequired
}
