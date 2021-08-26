import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Link, Typography } from '@material-ui/core'

import ExternalLinkIcon from './ExternalLinkIcon.jsx'

const useStyles = makeStyles((theme) => ({
  smallSize: { fontSize: '12px' },
  smallDisabled: { fontSize: '12px', color: theme.palette.text.disabled },
  normalDisabled: { color: theme.palette.text.disabled },
  iconStyle: {
    fontSize: '12px',
    paddingRight: '4px'
  },
  disabledIconStyle: {
    fontSize: '12px',
    paddingRight: '4px',
    color: theme.palette.text.disabled
  }
}))

export default function ExternalLink (props) {
  // Deconstruct props
  const { href, children, small, disabled, ...restProps } = props

  // Make class names
  const { smallSize, smallDisabled, normalDisabled, disabledIconStyle, iconStyle } = useStyles()

  // When disabled, use 'Typography' instead
  if (disabled) {
    return (
      <Typography
        className={small ? smallDisabled : normalDisabled}
        {...restProps}
      >
        <ExternalLinkIcon className={disabledIconStyle} />
        {children}
      </Typography>
    )
  }

  // When enabled, use Link
  return (
    <Link
      href={href}
      target="_blank"
      className={small ? smallSize : ''}
      {...restProps}
    >
      <ExternalLinkIcon className={iconStyle} />
      {children}
    </Link>
  )
}

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string,
    underlineNone: PropTypes.string,
    underlineHover: PropTypes.string,
    underlineAlways: PropTypes.string,
    button: PropTypes.string,
    focusVisible: PropTypes.string
  }),
  small: PropTypes.bool,
  disabled: PropTypes.bool
}

ExternalLink.defaultProps = {
  disabled: false,
  small: false,
  classes: {}
}
