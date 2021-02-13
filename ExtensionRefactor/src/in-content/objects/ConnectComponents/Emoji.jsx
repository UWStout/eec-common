import React from 'react'

/**
 *
 * @param {string} symbol The actual unicode emoji
 * @param {string} label The aria-label description of the emoji
 */
const Emoji = props => (
  <span
    className='emoji'
    role='img'
    title={props.label ? props.label : ''}
    aria-label={props.label ? props.label : ''}
    aria-hidden={props.label ? 'false' : 'true'}
  >
    {props.symbol}
  </span>
)

export default Emoji
