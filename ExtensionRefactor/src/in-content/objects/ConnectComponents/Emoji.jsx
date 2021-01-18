import React from 'react'

/* 
 * Standardized emoji object for use within rendered react bodies
 * Props: 
 * symbol - emoji literal to display
 * label  - aria-label for accessibility readers
 */
const Emoji = props => (
  <span
    className='emoji'
    role='img'
    aria-label={props.label ? props.label : ''}
    aria-hidden={props.label ? 'false' : 'true'}
  >
    {props.symbol}
  </span>
)

export default Emoji
