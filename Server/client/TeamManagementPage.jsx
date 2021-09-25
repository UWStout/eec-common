import React from 'react'
import ReactDOM from 'react-dom'

import { RecoilRoot } from 'recoil'

import { createTheme } from '@material-ui/core/styles'
import { Container, CssBaseline, Box, ThemeProvider } from '@material-ui/core'

import DataList from './adminComponents/DataList.jsx'
import Copyright from './sharedComponents/Copyright.jsx'

// Sort by options shown in the full nav bar
const teamFieldOptions = [
  { text: 'Team Name', value: 'name' },
  { text: 'Team ID', value: '_id' },
  { text: 'Org Unit Name', value: 'unitName' },
  { text: 'Org Unit ID', value: 'orgId' }
]

// Create a default theme
const theme = createTheme()

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <RecoilRoot>
        <DataList
          dataType={'team'}
          sortByOptions={teamFieldOptions}
          filterByOptions={teamFieldOptions}
        />
      </RecoilRoot>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  </ThemeProvider>,
  document.getElementById('root')
)
