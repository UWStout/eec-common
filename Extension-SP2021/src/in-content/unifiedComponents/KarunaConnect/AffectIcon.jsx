import React from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue, useRecoilState } from 'recoil'
import * as STATE from '../data/globalState.js'

import { Typography } from '@material-ui/core'
import { Visibility } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import CustomTooltip from './CustomTooltip.jsx'

import { AffectObjectShape } from '../data/dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  iconRoot: {
    position: 'relative'
  },
  privacyIcon: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    fontSize: '10pt'
  }
}))

export default function AffectIcon (props) {
  const { ...restProps } = props
  const { iconRoot, privacyIcon } = useStyles()

  // Values and mutator functions for global state (GLOBAL STATE)
  const privacy = useRecoilValue(STATE.PrivacyPrefsState)
  const affectObj = useRecoilValue(STATE.UserAffectIDState)

  const tooltip = `${affectObj?.name ? affectObj.name : 'none'}\n${privacy ? '(hidden)' : '(visible)'}`

  return (
    <CustomTooltip {...restProps} title={tooltip}>
      <Typography variant='body1' align='center' gutterBottom className={iconRoot}>
        {affectObj?.characterCodes[0] ? affectObj.characterCodes[0] : '?'}
        {!privacy && <Visibility className={privacyIcon} />}
      </Typography>
    </CustomTooltip>
  )
}
