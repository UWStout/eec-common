import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Button, List, ListItem, ListItemText, Link, Grid } from '@material-ui/core'

import KarunaIcon from '../clientComponents/KarunaIcon.jsx'
import InstructionPanel from './InstructionPanel.jsx'

const SERVER_ROOT = ''
const siteMapLinks = [
  { href: `${SERVER_ROOT}Login.html`, text: 'General login page for accessing backend server pages' },
  { href: `${SERVER_ROOT}Logout.html`, text: 'Clear credentials from a previous login' },
  { href: `${SERVER_ROOT}Register.html`, text: 'Create a new standard Karuna account' },
  { href: `${SERVER_ROOT}Recovery.html`, text: 'Account recovery form (not yet implemented)' },
  { href: `${SERVER_ROOT}dbAdmin/Users.html`, text: 'User data viewing and editing' },
  { href: `${SERVER_ROOT}dbAdmin/Teams.html`, text: 'Team data viewing and editing' },
  { href: `${SERVER_ROOT}dbAdmin/OrgUnits.html`, text: 'Org Unit data viewing and editing' }
]

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  headingText: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderTop: '1px solid lightgrey',
    borderBottom: '1px solid lightgrey'
  },
  accordion: {
    width: '100%'
  },
  listRoot: {
    width: '100%',
    backgroundColor: theme.palette.background.default,
    border: '1px solid lightgray',
    borderRadius: theme.spacing(0.5)
  },
  spaceOut: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  spaceOut2: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  listItem: {
    borderBottom: '1px solid lightgray'
  },
  lastListItem: {
  },
  figure: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: 0,
    fontSize: '1.25rem'
  },
  figureImage: {
    verticalAlign: 'middle',
    width: '100%',
    border: '1px solid lightgray'
  },
  strong: {
    fontWeight: 'bold'
  }
}))

export default function Instructions () {
  // Styles and state
  const classes = useStyles()
  const [expanded, setExpanded] = useState('')
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '')
  }

  return (
    <div className={classes.paper}>
      <KarunaIcon />
      <Typography component="h1" variant="h5">
        {'Welcome to Karuna'}
      </Typography>

      <Typography variant="body1" className={classes.headingText}>
        {'Welcome to the development server for the Karuna EEC tool! From here, you can download and '}
        {'install the latest version of the Chrome Extension Alpha. You will also find instructions for '}
        {'installing and activating the extension.'}
      </Typography>

      <div className={classes.accordion}>
        <InstructionPanel
          name={'store-instructions'}
          expanded={expanded}
          handleChange={handleChange}
          headerText={'Extension Installation (preferred)'}
          headerSecondary={'Install/update from Chrome Web Store'}
        >
          <Typography variant={'body1'}>
            {'Web store instructions coming soon (waiting for store approval)'}
          </Typography>
        </InstructionPanel>

        <InstructionPanel
          name={'manual-instructions'}
          expanded={expanded}
          handleChange={handleChange}
          headerText={'Extension Installation (manual)'}
          headerSecondary={'Install manually'}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant={'body1'}>
                {'To use the latest development version of the extension, it must be installed '}
                {'manually as an "unpacked extension."'}
              </Typography>
            </Grid>

            <Grid container item xs={12} justifyContent="center">
              <div className={classes.spaceOut}>
                <Button
                  variant="contained"
                  color="primary"
                  href="./media/KarunaEEC-Extension.zip"
                >
                  {'Download Karuna Extension'}
                </Button>
              </div>
            </Grid>

            <Grid container item xs={12}>
              <Typography component="h2" variant="h6">
                {'Downloading the Extension:'}
              </Typography>

              <List aria-label="Manual Download Steps" className={classes.listRoot}>
                <ListItem className={classes.listItem}>
                  <ListItemText>
                    {'Click the above button to Download the extension archive.'}
                  </ListItemText>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemText>
                    {'Locate the archive on your computer (look in your "downloads" folder)'}
                  </ListItemText>
                </ListItem>
                <ListItem className={classes.lastListItem}>
                  <ListItemText>
                    {'Extract all files from the archive to a folder on your computer '}
                    <Link href="#figure1">{'(fig 1)'}</Link>
                    {':'}
                    <br />
                    <ol>
                      <li>{'Select the archive zip file'}</li>
                      <li>{'Click "Compressed Folder Tools"'}</li>
                      <li>{'Click "Extract all" and point it to a reasonable location on your computer'}</li>
                    </ol>
                    <br />
                    <figure className={classes.figure} id="figure1">
                      <img
                        className={classes.figureImage}
                        src="./media/ExtractAll.png"
                        alt={'Screenshot showing the zip archive selected in the windows file ' +
                            'explorer and pointing out the "compressed tools" and "extract all" ' +
                            'options.'}
                      />
                      <Typography variant="caption">
                        <span className={classes.strong}>Figure 1:</span>
                        {' Expanding the extension archive.'}
                      </Typography>
                    </figure>
                  </ListItemText>
                </ListItem>
              </List>
            </Grid>

            <Grid container item xs={12}>
              <Typography component="h2" variant="h6">
                {'Installing the Extension:'}
              </Typography>

              <List aria-label="Manual Install Steps" className={classes.listRoot}>
                <ListItem className={classes.lastListItem}>
                  <ListItemText>
                    <Typography variant="body1">
                      {'Enable developer mode and load an unpacked extension (as sown in '}
                      <Link href="#figure2">{'Figure 2'}</Link>
                      {'):'}
                    </Typography>

                    <ul style={{ listStyleType: 'none' }}>
                      <li>
                        <span className={classes.strong}>1)</span>
                        {' Open Chrome and visit the URL "chrome://extensions" '}
                      </li>
                      <li>
                        <span className={classes.strong}>2)</span>
                        {' In the upper right, toggle the "Developer Mode" to the on position'}
                      </li>
                      <li>
                        <span className={classes.strong}>3)</span>
                        {' Click the "Load Unpacked"'}
                      </li>
                    </ul>

                    <br />
                    <figure className={classes.figure} id="figure2">
                      <img
                        className={classes.figureImage}
                        src="./media/InstallUnpacked.png"
                        alt={
                          'Screenshot showing the "chrome://extensions" page pointing out ' +
                          'the "developer mode" toggle and the "load unpacked" button.'
                        }
                      />
                      <Typography variant="caption">
                        <span className={classes.strong}>{'Figure 2:'}</span>
                        {'Installing and enabling the extension'}
                      </Typography>
                    </figure>
                  </ListItemText>
                </ListItem>

                <ListItem className={classes.lastListItem}>
                  <ListItemText>
                    <Typography variant="body1">
                      {'Navigate to the extension folder (as sown in '}
                      <Link href="#figure3">{'Figure 3'}</Link>
                      {'):'}
                    </Typography>
                    <ul style={{ listStyleType: 'none' }}>
                      <li>
                        <span className={classes.strong}>4)</span>
                        {' Navigate to the expanded extension folder on your computer '}
                      </li>
                      <li>
                        <span className={classes.strong}>5)</span>
                        {' Click "select folder" to load and activate the extension'}
                      </li>
                    </ul>

                    <br />
                    <figure className={classes.figure} id="figure3">
                      <img
                        className={classes.figureImage}
                        src="./media/SelectFolder.png"
                        alt={
                          'Screenshot showing the folder selection interface after clicking ' +
                          '"load unpacked" pointing out the path and the "select folder" button.'
                        }
                      />
                      <Typography variant="caption">
                        <span className={classes.strong}>{'Figure 3:'}</span>
                        {'Selecting the unpacked folder (your folder path may be different)'}
                      </Typography>
                    </figure>
                  </ListItemText>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </InstructionPanel>

        <InstructionPanel
          name={'other-pages'}
          expanded={expanded}
          handleChange={handleChange}
          headerText={'Other Server Pages'}
          headerSecondary={'Access other pages on the Karuna Server'}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="body1" className={classes.spaceOut2}>
                {'Here is a list of other pages available on this server. Note that some of '}
                {'these will only be accessible by admin accounts.'}
              </Typography>
            </Grid>

            <Grid container item xs={12} className={classes.listRoot} style={{ padding: '16px' }}>
              {siteMapLinks.map((curLink, i) => (
                <React.Fragment key={i}>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography variant="subtitle1" className={classes.spaceOut2}>
                      <Link href={curLink.href}>{curLink.href}</Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={8} md={9}>
                    <Typography variant="subtitle1" className={classes.spaceOut2}>
                      {curLink.text}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </InstructionPanel>
      </div>
    </div>
  )
}
