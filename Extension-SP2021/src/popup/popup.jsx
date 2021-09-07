// Basic react usage
import React from 'react'
import ReactDOM from 'react-dom'

// Material-UI components
import { Container, CssBaseline, Box } from '@material-ui/core'

// Karuna Popup widget interface
import PopupWidget from './components/PopupWidget.jsx'

// Function to initialize communication between contexts
import { attachBackgroundPage } from './communication.js'

// Variables about server communication
import { HOST_NAME } from '../util/serverConfig.js'

// Retrieve the background context
document.addEventListener('DOMContentLoaded',
  attachBackgroundPage(messageReceived)
)

// Just log messages received for now
function messageReceived (message, sender, sendResponse) {
  console.log(`POPUP: Message from ${sender.url} => ${sender.id}`)
  console.log(message)
}

const containerStyle = {
  minWidth: '600px'
}

// Render Karuna main popup widget
ReactDOM.render(
  // eslint-disable-next-line react/forbid-component-props
  <Container component="main" maxWidth="md" style={containerStyle}>
    <CssBaseline />
    <Box mx={2} mt={4} mb={4}>
      <PopupWidget
        version={_VER_}
        mode={_DEV_ ? 'development' : 'production'}
        serverHost={`https://${HOST_NAME}`}
      />
    </Box>
  </Container>,
  document.getElementById('root')
)
