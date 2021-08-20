import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Slide } from '@material-ui/core'
import { promoteUser } from './dataHelper.js'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  contentStyle: {
    overflowY: 'hidden'
  }
}))

const nameStyle = {
  fontWeight: 'bolder'
}

export default function PromoteUserDialog (props) {
  const { userId, userName, open, onDialogClose } = props
  const classes = useStyles()

  const handleClose = async (doPromotion) => {
    if (doPromotion) {
      try {
        await promoteUser(userId)
        onDialogClose(true)
      } catch (err) {
        console.error('Failed to promote user')
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
      aria-labelledby="user-promote-dialog-title"
    >
      <DialogTitle id="user-promote-dialog-title">Promote User to Admin</DialogTitle>
      <DialogContent className={classes.contentStyle}>
        <DialogContentText>
          {'Are you sure you want to promote '}
          <span style={nameStyle}>{userName}</span>
          {' to "admin" status?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => { handleClose(false) }} color="primary">{'Cancel'}</Button>
        <Button
          onClick={(e) => { handleClose(true) }}
          color="secondary"
          variant="contained"
          disableElevation
        >
          {'Promote'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

PromoteUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired
}
