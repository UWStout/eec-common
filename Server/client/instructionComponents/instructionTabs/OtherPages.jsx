import React from 'react'

import { Typography, Grid, Link } from '@material-ui/core'

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

export default function OtherPages () {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography component="h2" variant="h5">
          {'Other Web Server Pages'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1">
          {'Below is a list of other pages available on this server. Note that some of '}
          {'these will only be accessible by admin accounts.'}
        </Typography>
      </Grid>

      <Grid container item spacing={1} xs={12}>
        {siteMapLinks.map((curLink, i) => (
          <React.Fragment key={i}>
            <Grid item xs={6} sm={4} md={3}>
              <Typography variant="subtitle1">
                <Link href={curLink.href}>{curLink.href}</Link>
              </Typography>
            </Grid>
            <Grid item xs={6} sm={8} md={9}>
              <Typography variant="subtitle1">
                {curLink.text}
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Grid>
  )
}
