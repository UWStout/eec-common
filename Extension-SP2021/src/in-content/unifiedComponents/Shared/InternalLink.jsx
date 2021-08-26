import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Link, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  smallSize: { fontSize: '12px' },
  smallDisabled: { fontSize: '12px', color: theme.palette.text.disabled },
  normalDisabled: { color: theme.palette.text.disabled }
}))

export default function InternalLink (props) {
  // Deconstruct props
  const { children, small, disabled, ...restProps } = props

  // Make class names
  const { smallSize, smallDisabled, normalDisabled } = useStyles()

  // When disabled, use 'Typography' instead
  if (disabled) {
    return (
      <Typography
        className={small ? smallDisabled : normalDisabled}
        {...restProps}
        onClick={() => {}} // Deliberately erase the on-click callback
      >
        {children}
      </Typography>
    )
  }

  // When enabled, use Link
  return (
    <Link
      className={small ? smallSize : ''}
      {...restProps}
    >
      {children}
    </Link>
  )
}

InternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  small: PropTypes.bool,
  disabled: PropTypes.bool
}

InternalLink.defaultProps = {
  disabled: false,
  small: false
}
