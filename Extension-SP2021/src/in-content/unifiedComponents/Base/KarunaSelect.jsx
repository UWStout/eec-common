import React from 'react'

import { Select } from '@material-ui/core'
import { ArrowDropDown } from '@material-ui/icons'

export default function KarunaSelect (props) {
  return (
    <Select IconComponent={ArrowDropDown} {...props} />
  )
}
