import React from 'react'
import ReactDOM from 'react-dom'
import RadialTest from './popup/components/RadialTest.jsx'

import { initPopupScript } from './popup/communication.js'

// Fire scripts after page has loaded
document.addEventListener('DOMContentLoaded', initPopupScript)

const items = [
  { href: 'http://www.facebook.com', image: 'url(facebook.png)' },
  { href: 'http://www.reddit.com', image: 'url(reddit.png)' },
  { href: 'http://www.flickr.com', image: 'url(flickr.png)' },
  { href: 'http://www.google.com', image: 'url(googleplus.png)' }
]

const center = {
  image: 'url(share.png)'
}

ReactDOM.render(
  <div style={{ padding: '140px 180px' }}>
    <RadialTest animation="shrinkIn" items={items} center={center}
      stagger={0} duration={300} itemsSize={50} />
  </div>,
  document.body
)
