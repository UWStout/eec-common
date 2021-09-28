import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, Link, TextField, InputAdornment, Select, MenuItem } from '@material-ui/core'

import KarunaIcon from '../sharedComponents/KarunaIcon.jsx'
import { checkTeamMember, retrieveItem, updateItem, userIsAdmin } from './dataHelper.js'
import ToggleEditor from './ToggleEditor.jsx'

const DEFAULT_LINKS = [
  { text: 'Nonviolent Communication', href: 'https://baynvc.org/basics-of-nonviolent-communication/' },
  { text: 'Principled Negotiation', href: 'https://www.pon.harvard.edu/daily/dispute-resolution/principled-negotiation-resolve-disagreements/' },
  { text: 'Integrative Negotiation', href: 'https://www.pon.harvard.edu/daily/negotiation-skills-daily/find-more-value-at-the-bargaining-table/' },
  { text: 'Active Listening', href: 'https://positivepsychology.com/active-listening/' },
  { text: 'Critical Thinking', href: 'https://www.skillsyouneed.com/learn/critical-thinking.html' },
  { text: 'Focused Conversation', href: 'https://www.learnalberta.ca/content/aswt/talkingtogether/facilitated_art_of_focused_conversation_fact_sheet.html' }
]

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
  topBox: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(3)
  },
  editorBox: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    minHeight: 200
  },
  commModelInputStyle: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  selectMenuStyle: {
    display: 'flex',
    flexDirection: 'column'
  }
}))

export default function TeamCultureComponent (props) {
  // Destructure component props
  const { user, teamID } = props
  const classes = useStyles()

  // The last value saved to or retrieved from the DB
  const [teamCultureMD, setTeamCultureMD] = useState('loading ...')
  const [commModelLink, setCommModelLink] = useState('')

  // Is the current user a member of the team in question
  const [isMemberOrAdmin, setIsMemberOrAdmin] = useState(true)

  // Is an asynchronous update active?
  const [asyncActive, setAsyncActive] = useState(false)

  const defaultLinkMenuItems = DEFAULT_LINKS.map((link, i) => (
    <MenuItem key={i} value={link.href}>{link.text}</MenuItem>
  ))

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
          setCommModelLink(teamData.commModelLink)
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

  // Save cultureMD data to the DB
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

  // Save commModelLink data to the DB
  const syncCommModel = async (newCommModel) => {
    try {
      await updateItem('team', { id: teamID, commModelLink: newCommModel })
    } catch (err) {
      console.error(err)
    }
  }

  const updateCommModel = (newCommModelLink) => {
    setCommModelLink(newCommModelLink)
    syncCommModel(newCommModelLink)
  }

  // Get current page for use in redirection if needed
  const currentPage = encodeURIComponent(window.location)

  return (
    <React.Fragment>
      <div className={classes.headingRoot}>
        <KarunaIcon />
        <Typography component="h1" variant="h4">
          {'Team Comm Model / Culture Document'}
        </Typography>
      </div>

      {!user ?
        <Box p={3} className={classes.topBox}>
          <Typography variant="body1">
            {'Please '}
            <Link color="inherit" underline="always" href={`/Login.html?dest=${currentPage}`}>
              {'login'}
            </Link>
            {' to continue.'}
          </Typography>
        </Box> :

          (!teamID || !isMemberOrAdmin ?
            <Box p={3} className={classes.topBox}>
              <Typography variant="body1">
                {'Invalid team. Make sure ID is included in URL and that you are a member of that team.'}
              </Typography>
            </Box> :

            <React.Fragment>
              <Box p={3} className={classes.topBox}>
                <Typography component="h2" variant="h5">
                  {'Team Communication Model Link'}
                </Typography>
                <TextField
                  value={commModelLink}
                  onChange={(e) => { updateCommModel(e.target.value) }}
                  className={classes.commModelInputStyle}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Select
                          displayEmpty
                          renderValue={() => ('Standard Options')}
                          onChange={(e) => { updateCommModel(e.target.value) }}
                          aria-label={'Standard Options'}
                          MenuProps={{ MenuListProps: { className: classes.selectMenuStyle } }}
                          disableUnderline
                        >
                          {defaultLinkMenuItems}
                        </Select>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box p={3} className={classes.editorBox}>
                <ToggleEditor
                  markdown={teamCultureMD}
                  saveChanges={saveChanges}
                  disabled={asyncActive}
                />
              </Box>
            </React.Fragment>)}
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
