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

  const handleClose = async (doDelete) => {
    if (doDelete) {
      try {
        await deleteItem(dataType, itemId)
        onDialogClose(true)
      } catch (err) {
        console.error('Failed to delete item')
        console.error(err)
      }
    } else {
      onDialogClose(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={(e, reason) => { if (reason !== 'backdropClick') { handleClose(false) } }}
      fullWidth
      maxWidth={'sm'}
      TransitionComponent={Transition}
      aria-labelledby="unit-edit-dialog-title"
    >
      <DialogTitle id="unit-edit-dialog-title">Edit Org Unit</DialogTitle>
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => { handleClose(false) }} color="primary">{'Cancel'}</Button>
        <Button
          onClick={(e) => { handleClose(true) }}
          color="secondary"
          variant="contained"
          disableElevation
          disabled={confirmText !== userConfirmText}
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
