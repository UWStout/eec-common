import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Slide } from '@material-ui/core'
import { deleteItem } from './dataHelper.js'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  contentStyle: {
    overflowY: 'hidden'
  }
}))

const confirmStyle = {
  fontWeight: 'bolder',
  paddingLeft: '16px'
}

export default function ItemDeleteDialog (props) {
  const { itemId, dataType, confirmText, open, onDialogClose } = props
  const classes = useStyles()

  const [userConfirmText, setUserConfirmText] = useState('')
  const [formDisabled, setFormDisabled] = useState(false)

  const closeDialog = (state) => {
    setUserConfirmText('') // reset form back to empty
    setFormDisabled(false)
    if (onDialogClose) {
      onDialogClose(state)
    }
  }

  const handleClose = async (doDelete) => {
    setFormDisabled(true)
    if (doDelete) {
      try {
        await deleteItem(dataType, itemId)
        closeDialog(true)
      } catch (err) {
        window.alert(`Failed to delete ${dataType}\n\n${err?.response?.data?.message}`)
        console.error(`Failed to delete ${dataType}`)
        console.error(err)
        setFormDisabled(false)
      }
    } else {
      closeDialog(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={(e, reason) => { if (reason !== 'backdropClick') { handleClose(false) } }}
      fullWidth
      maxWidth={'sm'}
      TransitionComponent={Transition}
      aria-labelledby="item-delete-dialog-title"
    >
      <DialogTitle id="item-delete-dialog-title">{`Delete ${dataType}`}</DialogTitle>
      <DialogContent className={classes.contentStyle}>
        <DialogContentText>
          {'This will permanently delete this item, removing it from the database.'}
          <br />
          <br />
          {'THIS OPERATION CANNOT BE UNDONE! To confirm, enter:'}
          <br />
          <span style={confirmStyle}>{confirmText}</span>
        </DialogContentText>
        <TextField
          required
          id="confirmText"
          name="confirmText"
          fullWidth
          value={userConfirmText}
          onChange={(e) => { setUserConfirmText(e.target.value) }}
          disabled={formDisabled}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => { handleClose(false) }} color="primary" disabled={formDisabled}>{'Cancel'}</Button>
        <Button
          onClick={(e) => { handleClose(true) }}
          color="secondary"
          variant="contained"
          disableElevation
          disabled={confirmText !== userConfirmText || formDisabled}
        >
          {'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ItemDeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  itemId: PropTypes.string.isRequired,
  dataType: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired
}
