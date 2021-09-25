import React from 'react'

import { useRecoilState, useRecoilValue } from 'recoil'
import { UserCollaborationState } from '../data/globalSate/userState.js'
import { DisableInputState } from '../data/globalSate/appState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Select, MenuItem } from '@material-ui/core'

import { rawCollaborationIcon } from '../Shared/CollaborationIcon.jsx'

function makeCollaboration (collaboration, iconTweakStyle) {
  return (
    <React.Fragment>
      <span className={iconTweakStyle}>{rawCollaborationIcon(collaboration)}</span>
      {collaboration ? ` ${collaboration}` : ' unknown'}
    </React.Fragment>
  )
}

const useStyles = makeStyles((theme) => ({
  indentLeft: {
    marginLeft: theme.spacing(2)
  },
  selectInputStyle: {
    // Important because the input root style will otherwise override to 'block'
    display: 'inline-flex !important',
    alignItems: 'center'
  },
  selectMenuStyle: {
    display: 'flex',
    flexDirection: 'column'
  },
  iconTweakStyle: {
    position: 'relative',
    top: '0.125em',
    marginRight: theme.spacing(1)
  }
}))

export default function CollaborationForm (props) {
  const { indentLeft, selectInputStyle, selectMenuStyle, iconTweakStyle } = useStyles()

  const disableAllInput = useRecoilValue(DisableInputState)
  const [collaboration, setCollaboration] = useRecoilState(UserCollaborationState)
  const onChangeCollaboration = (e) => {
    setCollaboration(e.target.value)
  }

  return (
    <Select
      aria-label="Change Collaboration Status"
      value={collaboration}
      onChange={onChangeCollaboration}
      className={indentLeft}
      inputProps={{ className: selectInputStyle }}
      disabled={disableAllInput}
      MenuProps={{ MenuListProps: { className: selectMenuStyle } }}
    >
      <MenuItem value={'Focused'}>{makeCollaboration('Focused', iconTweakStyle)}</MenuItem>
      <MenuItem value={'Open to Collaboration'}>{makeCollaboration('Open to Collaboration', iconTweakStyle)}</MenuItem>
      <MenuItem value={'Currently Collaborating'}>{makeCollaboration('Currently Collaborating', iconTweakStyle)}</MenuItem>
    </Select>
  )
}
