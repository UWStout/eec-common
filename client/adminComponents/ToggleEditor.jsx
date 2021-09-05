import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Fab, Tooltip } from '@material-ui/core'
import { Edit as EditIcon, Save as SaveIcon, Close as CloseIcon } from '@material-ui/icons'

import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/esm/index.css'

export function a11yPropsTab (name) {
  return {
    id: `action-tab-${name}`,
    'aria-controls': `action-tabpanel-${name}`
  }
}

const useStyles = makeStyles((theme) => ({
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

export default function ToggleEditor (props) {
  const { markdown, disabled, saveChanges, discardChanges } = props

  // Is markdown editing active
  const [editingActive, setEditingActive] = useState(false)

  // The current local markdown data (always sync with markdown prop when it changes)
  const [localMarkdown, setLocalMarkdown] = useState('')
  useEffect(() => { setLocalMarkdown(markdown) }, [markdown])

  // Track unsaved changes as state
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  useEffect(() => {
    setUnsavedChanges(localMarkdown !== markdown)
  }, [localMarkdown, markdown])

  // Save changes event
  const onSave = () => {
    if (saveChanges) {
      saveChanges(localMarkdown)
    }
  }

  // Discard changes event
  const onDiscard = () => {
    setLocalMarkdown(markdown)
    setEditingActive(false)
    if (discardChanges) {
      discardChanges()
    }
  }

  // Build class names
  const classes = useStyles({ editingActive })

  return (
    <React.Fragment>
      {editingActive ?
        <MDEditor
          value={localMarkdown}
          onChange={setLocalMarkdown}
          height={600}
          minHeight={400}
        /> :
        <MDEditor.Markdown source={localMarkdown} />}

      <div className={classes.floatingButtonBox}>
        {!editingActive ?
          <Tooltip title="Edit Team Culture">
            <span>
              <Fab
                color="primary"
                aria-label="edit"
                onClick={() => { setEditingActive(true) }}
                className={classes.floatingButton}
                disabled={disabled}
              >
                <EditIcon />
              </Fab>
            </span>
          </Tooltip> :

          <React.Fragment>
            <Tooltip title="Save Changes">
              <span>
                <Fab
                  variant="extended"
                  color={unsavedChanges ? 'primary' : 'default'}
                  aria-label="save"
                  onClick={onSave}
                  className={classes.floatingButton}
                  disabled={disabled}
                >
                  <SaveIcon />
                </Fab>
              </span>
            </Tooltip>

            <Tooltip title="Cancel Editing">
              <span>
                <Fab
                  variant="extended"
                  aria-label={unsavedChanges ? 'cancel' : 'close'}
                  color={unsavedChanges ? 'secondary' : 'default'}
                  onClick={onDiscard}
                  className={classes.floatingButton}
                  disabled={disabled}
                >
                  <CloseIcon className={classes.extendedIcon} />
                  {unsavedChanges ? 'Cancel' : 'Close'}
                </Fab>
              </span>
            </Tooltip>
          </React.Fragment>}
      </div>
    </React.Fragment>
  )
}

ToggleEditor.propTypes = {
  disabled: PropTypes.bool,
  markdown: PropTypes.string,
  saveChanges: PropTypes.func,
  discardChanges: PropTypes.func
}

ToggleEditor.defaultProps = {
  disabled: false,
  markdown: '',
  saveChanges: null,
  discardChanges: null
}
