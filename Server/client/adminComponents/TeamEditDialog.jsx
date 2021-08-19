import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Divider, Slide } from '@material-ui/core'
import { retrieveFullList, retrieveItem, updateItem } from './dataHelper'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  contentStyle: {
    overflowY: 'hidden'
  }
}))

export default function TeamEditDialog (props) {
  const { teamId, open, onDialogClose } = props
  const classes = useStyles()

  const [disableActions, setDisableActions] = useState(false)

  const [orgUnitList, setOrgUnitList] = useState([])
  const [teamName, setTeamName] = useState('')
  const [teamOrgId, setTeamOrgId] = useState('')

  useEffect(() => {
    if (!teamId) { return }
    (async () => {
      // Get list of all org units
      try {
        const allOrgUnits = await retrieveFullList('unit')
        setOrgUnitList(allOrgUnits)
      } catch (err) {
        console.error('Failed to retrieve org unit list')
        console.error(err)
      }

      // Get details for the indicated team
      try {
        const teamDetails = await retrieveItem('team', teamId)
        setTeamName(teamDetails.name)
        setTeamOrgId(teamDetails.orgId)
      } catch (err) {
        console.error('Failed to retrieve team details')
        console.error(err)
      }
    })()
  }, [teamId])

  const handleClose = async (save) => {
    if (save) {
      setDisableActions(true)
      try {
        await updateItem('team', { id: teamId, name: teamName, orgId: teamOrgId })
        onDialogClose({ name: teamName, orgId: teamOrgId })
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
      aria-labelledby="team-edit-dialog-title"
    >
      <DialogTitle id="team-edit-dialog-title">Edit Team</DialogTitle>
      <DialogContent className={classes.contentStyle}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="teamName"
              name="teamName"
              label="Team Name"
              fullWidth
              value={teamName}
              onChange={(e) => { setTeamName(e.target.value) }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="teamOrgUnitId"
              name="teamOrgUnitId"
              label="Team Org Unit"
              select
              fullWidth
              value={teamOrgId}
              onChange={(e) => { setTeamOrgId(e.target.value) }}
            >
              <MenuItem key={'none'} value={''}>
                {'None'}
              </MenuItem>
              <Divider />
              {orgUnitList.map((orgUnit) => (
                <MenuItem key={orgUnit._id} value={orgUnit._id}>
                  {orgUnit.name}
                </MenuItem>
              ))}
            </TextField>
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

TeamEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  teamId: PropTypes.string.isRequired
}