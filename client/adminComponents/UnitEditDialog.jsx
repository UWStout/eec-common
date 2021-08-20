import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@material-ui/core'
import { retrieveItem, updateItem } from './dataHelper'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  contentStyle: {
    overflowY: 'hidden'
  }
}))

export default function UnitEditDialog (props) {
  const { unitId, open, onDialogClose } = props
  const classes = useStyles()

  const [disableActions, setDisableActions] = useState(false)
  const [unitName, setUnitName] = useState('')

  useEffect(() => {
    if (!unitId) { return }
    (async () => {
      // Get details for the indicated team
      try {
        const unitDetails = await retrieveItem('unit', unitId)
        setUnitName(unitDetails.name)
      } catch (err) {
        console.error('Failed to retrieve unit details')
        console.error(err)
      }
    })()
  }, [unitId])

  const handleClose = async (save) => {
    if (save) {
      setDisableActions(true)
      try {
        await updateItem('unit', { id: unitId, name: unitName })
        onDialogClose()
      } catch (err) {
        console.error('Failed to save data')
        console.error(err)
      } finally {
        setDisableActions(false)
      }
    } else {
      onDialogClose()
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="unitName"
              name="unitName"
              label="Organization Unit Name"
              fullWidth
              value={unitName}
              onChange={(e) => { setUnitName(e.target.value) }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => { handleClose(false) }} color="primary" disabled={disableActions}>{'Cancel'}</Button>
        <Button onClick={(e) => { handleClose(true) }} color="primary" disabled={disableActions}>{'Save'}</Button>
      </DialogActions>
    </Dialog>
  )
}

UnitEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  unitId: PropTypes.string.isRequired
}
