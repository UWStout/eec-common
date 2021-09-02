import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, Fab, Tooltip } from '@material-ui/core'
import { Edit as EditIcon, Save as SaveIcon, Close as CloseIcon } from '@material-ui/icons'

import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/esm/index.css'

import KarunaIcon from '../sharedComponents/KarunaIcon.jsx'

export function a11yPropsTab (name) {
  return {
    id: `action-tab-${name}`,
    'aria-controls': `action-tabpanel-${name}`
  }
}

const useStyles = makeStyles((theme) => ({
  headingRoot: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  pageRoot: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    minHeight: 200
  },
  floatingButtonBox: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    borderTop: (params) => (params.editingActive ? '' : '1px solid lightgray')
  },
  floatingButton: {
    margin: theme.spacing(1)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}))

export default function InstructionsTabbed () {
  // Is markdown editing active
  const [editingActive, setEditingActive] = useState(false)

  // The last value saved to or retrieved from the DB
  const [teamCultureMD, setTeamCultureMD] = useState('loading ...')

  // The current local markdown data
  const [localMarkdown, setLocalMarkdown] = useState(teamCultureMD)

  // Compute styling classes using parameters
  const classes = useStyles({ editingActive })

  // Retrieve team culture from database
  useEffect(() => {
    // TODO
  }, [])

  // When team culture changes, be sure to sync local culture
  useEffect(() => {
    setLocalMarkdown(teamCultureMD)
  }, [teamCultureMD])

  // Track unsaved changes as state
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  useEffect(() => {
    setUnsavedChanges(localMarkdown !== teamCultureMD)
  }, [localMarkdown, teamCultureMD])

  // Simulate saving by just setting equal for now
  const saveChanges = () => {
    setTeamCultureMD(localMarkdown)
  }

  // Simulate discarding
  const discardChanges = () => {
    setLocalMarkdown(teamCultureMD)
    setEditingActive(false)
  }

  return (
    <React.Fragment>
      <div className={classes.headingRoot}>
        <KarunaIcon />
        <Typography component="h1" variant="h4">
          {'Team Culture Document'}
        </Typography>
      </div>

      <Box p={3} className={classes.pageRoot}>
        {editingActive ?
          <MDEditor
            value={localMarkdown}
            onChange={setLocalMarkdown}
          /> :
          <MDEditor.Markdown source={localMarkdown} />}

        <div className={classes.floatingButtonBox}>
          {!editingActive ?
            <Tooltip title="Edit Team Culture">
              <Fab
                color="primary"
                aria-label="edit"
                onClick={() => { setEditingActive(true) }}
                className={classes.floatingButton}
              >
                <EditIcon />
              </Fab>
            </Tooltip> :

            <React.Fragment>
              <Tooltip title="Save Changes">
                <Fab
                  variant="extended"
                  color={unsavedChanges ? 'primary' : 'default'}
                  aria-label="save"
                  onClick={() => { saveChanges() }}
                  className={classes.floatingButton}
                >
                  <SaveIcon />
                </Fab>
              </Tooltip>

              <Tooltip title="Cancel Editing">
                <Fab
                  variant="extended"
                  aria-label={unsavedChanges ? 'cancel' : 'close'}
                  color={unsavedChanges ? 'secondary' : 'default'}
                  onClick={() => { discardChanges() }}
                  className={classes.floatingButton}
                >
                  <CloseIcon className={classes.extendedIcon} />
                  {unsavedChanges ? 'Cancel' : 'Close'}
                </Fab>
              </Tooltip>
            </React.Fragment>}
        </div>
      </Box>
    </React.Fragment>
  )
}
