import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  emojiSpan: {
    width: '30px',
    paddingRight: '5px',
    fontSize: '18pt',
    marginTop: '-5px',
    marginBottom: '-5px'
  },
  svgIconSpan: {
    width: '30px',
    paddingRight: '5px',
    fontSize: '18pt',
    marginBottom: '-10px'
  },

  emojiSpanMore: {
    width: '30px',
    paddingRight: '10px',
    fontSize: '18pt',
    marginTop: '-5px',
    marginBottom: '-5px'
  },
  svgIconSpanMore: {
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

  const stringClass = props.padMore ? classes.emojiSpanMore : classes.emojiSpan
  const svgClass = props.padMore ? classes.svgIconSpanMore : classes.svgIconSpan

  if (typeof props.symbol === 'string' || !props.symbol) {
    return (
      <span className={stringClass} role='img' title={props.label ? props.label : ''}
        aria-label={props.label ? props.label : ''} aria-hidden={props.label ? 'false' : 'true'}>
        {props.symbol}
      </span>
    )
  } else {
    return (
      <span className={svgClass} role='img' title={props.label ? props.label : ''}
        aria-label={props.label ? props.label : ''} aria-hidden={props.label ? 'false' : 'true'}>
        {props.symbol}
      </span>
    )
  }
}

// Props validation
Emoji.propTypes = {
  padMore: PropTypes.bool,
  label: PropTypes.string,
  symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}
