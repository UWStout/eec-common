import React from 'react'
import ReactDOM from 'react-dom'

import { RecoilRoot } from 'recoil'

import { createTheme } from '@material-ui/core/styles'
import { Container, CssBaseline, Box, ThemeProvider } from '@material-ui/core'

import DataList from './adminComponents/DataList.jsx'
import Copyright from './sharedComponents/Copyright.jsx'

// Sort by options shown in the full nav bar
const orgUnitFieldOptions = [
  { text: 'Unit Name', value: 'name' },
  { text: 'ID', value: '_id' }
]

// Create a default theme
const theme = createTheme()

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <RecoilRoot>
        <DataList
          dataType={'unit'}
          sortByOptions={orgUnitFieldOptions}
          filterByOptions={orgUnitFieldOptions}
        />
      </RecoilRoot>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  </ThemeProvider>,
  document.getElementById('root')
)
