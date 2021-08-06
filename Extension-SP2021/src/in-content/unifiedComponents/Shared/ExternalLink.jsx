import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'

import ExternalLinkIcon from './ExternalLinkIcon.jsx'

const useStyles = makeStyles((theme) => ({
  smallSize: { fontSize: '12px' },
  iconStyle: {
    fontSize: '12px',
    paddingRight: '4px'
  }
}))

export default function ExternalLink (props) {
  // Deconstruct props
  const { href, children, ...restProps } = props

  // Make class names
  const { smallSize, iconStyle } = useStyles()

  return (
    <Link
      href={href}
      target="_blank"
      className={smallSize}
      {...restProps}
    >
      <ExternalLinkIcon className={iconStyle} />
      {children}
    </Link>
  )
}

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}
