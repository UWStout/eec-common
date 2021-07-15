import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  highlighter: {
    position: 'absolute',
    borderBottom: '1px solid #ff99ab'
  }
}))

export default function Highlighter (props) {
  const { rect } = props
  const { highlighter } = useStyles()

  return (
    <div
      className={highlighter}
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }}
    />
  )
}

Highlighter.propTypes = {
  rect: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired
}
