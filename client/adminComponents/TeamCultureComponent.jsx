import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, Link } from '@material-ui/core'

import KarunaIcon from '../sharedComponents/KarunaIcon.jsx'
import { checkTeamMember, retrieveItem, updateItem, userIsAdmin } from './dataHelper.js'
import ToggleEditor from './ToggleEditor.jsx'

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
  }
}))

export default function TeamCultureComponent (props) {
  // Destructure component props
  const { user, teamID } = props
  const classes = useStyles()

  // The last value saved to or retrieved from the DB
  const [teamCultureMD, setTeamCultureMD] = useState('loading ...')

  // Is the current user a member of the team in question
  const [isMemberOrAdmin, setIsMemberOrAdmin] = useState(true)

  // Is an asynchronous update active?
  const [asyncActive, setAsyncActive] = useState(false)

  // Retrieve team culture from database (once at start)
  useEffect(() => {
    const getTeamAsync = async () => {
      setAsyncActive(true)
      try {
        const isMember = await checkTeamMember(teamID)
        const isAdmin = userIsAdmin()
        setIsMemberOrAdmin(isMember || isAdmin)
        if (isMember || isAdmin) {
          const teamData = await retrieveItem('team', teamID)
          setTeamCultureMD(teamData.culture)
        }
      } catch (err) {
        window.alert('Failed to retrieve team culture (See console for details)')
        console.error('err')
      } finally {
        setAsyncActive(false)
      }
    }
    if (user && teamID) {
      getTeamAsync()
    }
  }, [user, teamID])

  // Simulate saving by just setting equal for now
  const saveChanges = (newMarkdown) => {
    const saveTeamAsync = async () => {
      setAsyncActive(true)
      try {
        await updateItem('team', { id: teamID, culture: newMarkdown })
        setTeamCultureMD(newMarkdown)
      } catch (err) {
        window.alert('Failed to save team culture (See console for details)')
        console.error(err)
      } finally {
        setAsyncActive(false)
      }
    }
    if (user && teamID) {
      saveTeamAsync()
    }
  }

  // Get current page for use in redirection if needed
  const currentPage = encodeURIComponent(window.location)

  return (
    <React.Fragment>
      <div className={classes.headingRoot}>
        <KarunaIcon />
        <Typography component="h1" variant="h4">
          {'Team Culture Document'}
        </Typography>
      </div>

      <Box p={3} className={classes.pageRoot}>
        {!user ?
          <Typography variant="body1">
            {'Please '}
            <Link color="inherit" underline="always" href={`/Login.html?dest=${currentPage}`}>
              {'login'}
            </Link>
            {' to continue.'}
          </Typography> :

            (!teamID || !isMemberOrAdmin ?
              <Typography variant="body1">{'Invalid team. Make sure ID is included in URL and that you are a member of that team.'}</Typography> :

              <ToggleEditor
                markdown={teamCultureMD}
                saveChanges={saveChanges}
                disabled={asyncActive}
              />)}
      </Box>
    </React.Fragment>
  )
}

TeamCultureComponent.propTypes = {
  teamID: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    userType: PropTypes.string
  })
}

TeamCultureComponent.defaultProps = {
  user: null
}
