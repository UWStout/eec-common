import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Link, Grid } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  tinyIcon: {
    height: '1rem'
  }
}))

export default function BasicUsage () {
  const { tinyIcon } = useStyles()

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography component="h2" variant="h5">
          {'Getting Started with Karuna'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1">
          {'After installing the Chrome Browser Extension from either the Chrome Web Store or using '}
          {'the Advanced Installation Option, you must first create a Karuna Account. At this time '}
          {'you must use the Chrome Browser to take advantage of the extension.'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          {'To ensure the Pop-Up is always visible use the extensions icon '}
          <img src="media/puzzleIcon.png" className={tinyIcon} alt="Small puzzle piece as extension icon in chrome." />
          {' and pin the Karuna extension so that it stays to the right of the url input bar.'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography component="h2" variant="h5">
          {'Account Creation'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          {'To create an account, use the Quick Link to Create Account from the Extension Pop-Up, '}
          {'or choose the Create Account tab on the '}
          <Link underline="always" href="https://karuna.run">{'karuna.run'}</Link>
          {' home page.'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          {'You must be logged in to an account to take advantage of Karuna’s features.'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography component="h2" variant="h5">
          {'Karuna Extension Components'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          {'Besides the extension popup (which is shown when you click the extension icon), the Karuna extension '}
          {'has two major components: the Karuna Connect Panel & the Karuna Bubble.'}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <img src="media/KarunaConnectPanel.png" alt="Screenshot of the Karuna Connect Panel component." />
        <br />
        <Typography variant="caption">
          {'Karuna Connect Panel in the (A) closed state, (B) hover state'}
          <br />
          {'and (C) expanded state.'}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <img src="media/KarunaBubble.png" alt="Screenshot of the Karuna Bubble component." />
        <br />
        <Typography variant="caption">
          {'Karuna Bubble prompting you to (A) log in and (B) update your feelings.'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography component="h2" variant="h5">
          {'Karuna Connect Panel Basic Usage'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          {'You must be logged in to Microsoft Teams or Discord (in Chrome Browser) for the Karuna Connect Panel and '}
          {'Bubble to appear. In the Karuna Connect Panel (right center of browser), you can:'}
        </Typography>
        <ul>
          <li>{'Expand the panel by hovering over the triangle or open the panel by clicking on the three dots.'}</li>
          <li>{'View your current mood, collaboration status , and time to respond.'}</li>
          <li>
            {'Change your current mood, status, or time to respond by clicking on the gear icon or a status icon:'}
            <ul>
              <li>{'Set your mood by choosing an emoji, and then choose to share it with the team or keep it private.'}</li>
              <li>{'Set your collaboration status (Open to collaborate, Currently Collaborating, or Focused).'}</li>
              <li>{'Set your typical time to respond to a message (in minutes, hours or days).'}</li>
            </ul>
          </li>
          <li>{'Switch teams (if you have more than one) from the tabs just below your personal status'}</li>
          <li>{'View current status information about all team members in your team'}</li>
          <li>{'Search for specific members of your team'}</li>
          <li>{'See the overall team temperature based on all publicly shared moods'}</li>
          <li>{'View information about your current team’s culture document (if you are a team manager, you can create or edit the document)'}</li>
          <li>{'View information about your current team’s communication model (e.g. non-violent communication)'}</li>
        </ul>
      </Grid>

      <Grid item xs={12}>
        <Typography component="h2" variant="h5">
          {'Karuna Bubble Basic Usage'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          {'From the Bubble (lower right of browser) Karuna will offer contextual help and reminders including:'}
        </Typography>
        <ul>
          <li>{'Reminders to set your current feeling'}</li>
          <li>
            {'just-in-time information about time to respond, mood, and collaboration status of the person you'}
            {'are currently communicating with.'}
          </li>
          <li>{'View other timely messages from the Karuna system such as login status, etc.'}</li>
        </ul>
      </Grid>
    </Grid>
  )
}
