import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button, Link, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Slide } from '@material-ui/core'
import { retrieveFullList, retrieveItem, updateItem } from './dataHelper'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  contentStyle: {
    overflowY: 'hidden'
  }
}))

export default function UserEditDialog (props) {
  // Unpack classes and compute style names
  const { userId, open, onDialogClose } = props
  const classes = useStyles()

  // Form ui state
  const [disableActions, setDisableActions] = useState(false)
  const [teamList, setTeamList] = useState([])

  // User data state
  const [fullName, setFullName] = useState('')
  const [preferredPronouns, setPreferredPronouns] = useState('')
  const [preferredName, setPreferredName] = useState('')
  const [email, setEmail] = useState('')
  const [userTeams, setUserTeams] = useState([])

  // Retrieve user info when the userId changes
  useEffect(() => {
    if (!userId) { return }
    (async () => {
      // Get list of all teams
      try {
        const allTeams = await retrieveFullList('team')
        setTeamList(allTeams)
      } catch (err) {
        console.error('Failed to retrieve team list')
        console.error(err)
      }

      // Get details for the indicated user
      try {
        const userDetails = await retrieveItem('user', userId)
        setFullName(userDetails.name)
        setPreferredName(userDetails.preferredName)
        setPreferredPronouns(userDetails.preferredPronouns)
        setEmail(userDetails.email)
        setUserTeams(userDetails.teams)
      } catch (err) {
        console.error('Failed to retrieve user details')
        console.error(err)
      }
    })()
  }, [userId])

  const closeDialog = (updatedUser) => {
    // setFullName('')
    // setPreferredName('')
    // setPreferredPronouns('')
    // setEmail('')
    // setTeamList([])
    if (onDialogClose) {
      onDialogClose(updatedUser)
    }
  }

  // Close dialog, optionally saving the edits
  const handleClose = async (save) => {
    if (save) {
      setDisableActions(true)
      try {
        await updateItem('user', {
          id: userId,
          name: fullName,
          preferredName,
          preferredPronouns,
          teams: userTeams
        })
        closeDialog()
      } catch (err) {
        console.error('Failed to save data')
        console.error(err)
      } finally {
        setDisableActions(false)
      }
    } else {
      closeDialog()
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
      <DialogTitle id="team-edit-dialog-title">
        {userId === '' ? 'Create New User' : 'Edit User'}
      </DialogTitle>
      <DialogContent className={classes.contentStyle}>
        <Grid container spacing={3}>
          {userId === '' ?
            // Create a new user
            <Grid item xs={12}>
              <DialogContentText>
                {'Please use the '}
                <Link href="../Register.html" target="_blank">{'Register Page'}</Link>
                {' to create a new user.'}
              </DialogContentText>
            </Grid> :

            // Edit an existing user
            <React.Fragment>
              <Grid item xs={12}>
                <TextField
                  required
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  fullWidth
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value) }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="preferredPronouns"
                  name="preferredPronouns"
                  label="Preferred pronouns"
                  fullWidth
                  autoComplete="pronouns"
                  value={preferredPronouns}
                  onChange={(e) => { setPreferredPronouns(e.target.value) }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="preferredName"
                  name="preferredName"
                  label="Preferred name"
                  fullWidth
                  autoComplete="nickname"
                  value={preferredName}
                  onChange={(e) => { setPreferredName(e.target.value) }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="email"
                  name="email"
                  label="email"
                  fullWidth
                  autoComplete="email"
                  value={email}
                  disabled
                  helperText={'A user\'s email cannot be changed with this form'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="userTeams"
                  name="userTeams"
                  label="Team Membership"
                  select
                  SelectProps={{ multiple: true }}
                  fullWidth
                  value={userTeams}
                  helperText={'Select zero or more teams to assign to that team'}
                  onChange={(e) => { setUserTeams(e.target.value) }}
                >
                  {teamList.map((team) => (
                    <MenuItem key={team._id} value={team._id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </React.Fragment>}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => { handleClose(false) }}
          color="primary"
          disabled={disableActions}
        >
          {'Cancel'}
        </Button>
        {userId !== '' &&
          <Button
            onClick={(e) => { handleClose(true) }}
            color="primary"
            disabled={disableActions}
          >
              {'Save'}
          </Button>}
      </DialogActions>
    </Dialog>
  )
}

UserEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
}
