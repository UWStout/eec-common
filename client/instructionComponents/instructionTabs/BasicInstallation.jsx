import React from 'react'

import { Typography, Grid, Link } from '@material-ui/core'

const EXTENSION_HREF = 'https://chrome.google.com/webstore/detail/karuna-eec-extension/hjcenbhhlapnjbbhifjndnkhknggkocc'

export default function BasicInstallation () {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography component="h2" variant="h5">
          {'Extension Installation Instructions'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1">
          {'Karuna uses a chrome browser extension to interact with the web version '}
          {'of popular team communication tools like '}
          <Link href="https://teams.microsoft.com" target="_blank">
            {'Microsoft Teams'}
          </Link>
          {' and '}
          <Link href="https://discord.com" target="_blank">
            {'Discord'}
          </Link>
          {'.'}
        </Typography>
      </Grid>

      <Grid container item justifyContent="center" xs={12}>
        <Link href={EXTENSION_HREF} target="_blank">
          <img
            src="./media/webStoreBadge.png"
            alt={'The standard chrome web store badge showing the Chrome web browser ' +
                  'logo and the text "Available in the Chrome Web Store"'}
          />
        </Link>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1">
          {'To install the extension, click the Chrome Web Store badge above.'}
        </Typography>
      </Grid>
    </Grid>
  )
}
