// Needed to polyfill async/await commands
import 'regenerator-runtime'

// Basic react usage
import React from 'react'
import ReactDOM from 'react-dom'

// Prototype Karuna widget interface
import MainMenu from './popup/components/MainMenu.jsx'

// Function to initialize communication between contexts
// (automatically run after content loads)
import { initPopupScript } from './popup/communication.js'

// Retrieve the background context
document.addEventListener('DOMContentLoaded',
  () => {
    initPopupScript().then((newBackground) => {
      window.extBackground = newBackground
    }).catch((error) => {
      window.extBackground = null
      console.error(error)
    })
  }
)

// <DISABLED UNTIL FIXED>
// // Experimental radial menu widget
// import RadialTest from './popup/components/RadialTest.jsx'
//
// // Part of experimental radial menu widget (disabled for now)
// const items = [
//   { href: 'http://www.facebook.com', image: 'url(facebook.png)' },
//   { href: 'http://www.reddit.com', image: 'url(reddit.png)' },
//   { href: 'http://www.flickr.com', image: 'url(flickr.png)' },
//   { href: 'http://www.google.com', image: 'url(googleplus.png)' }
// ]
//
// const center = {
//   image: 'url(share.png)'
// }
//
// // Render experimental radial menu
// ReactDOM.render(
//   <div style={{ padding: '20px 20px 20px 20px' }}>
//     <RadialTest animation="shrinkIn" items={items} center={center}
//       stagger={0} duration={300} itemsSize={50} />
//   </div>,
//   document.getElementById('root')
// )
// </DISABLED UNTIL FIXED>

// Render Karuna main popup widget
ReactDOM.render(
  <div style={{ padding: '20px 20px 20px 20px' }}>
    <MainMenu />
  </div>,
  document.getElementById('root')
)
