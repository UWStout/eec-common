import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import PanelTitle from './PanelTitle.jsx'
import ConnectMainContent from './ConnectMainContent.jsx'

// Just for dummy content while testing
import { LoremIpsum } from 'lorem-ipsum'
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
})

const useStyles = makeStyles((theme) => ({
  // Styling of the root paper element
  paperRoot: {
    // Margins and sizing
    padding: theme.spacing(2),
    paddingRight: theme.spacing(4),
    width: theme.spacing(25),
    height: theme.spacing(60),

    // Position element in window
    position: 'fixed',
    top: '20%',

    // Animate changes in the 'right' property
    transition: theme.transitions.create(
      ['right'], { duration: theme.transitions.duration.standard }
    )
  },

  // Style when the panel is retracted
  panelRetracted: {
    right: -theme.spacing(16)
  },

  // Style when the panel is fully expanded
  panelExpanded: {
    right: -theme.spacing(2)
  },

  // Style when the panel is hidden
  panelHidden: {
    right: -theme.spacing(35)
  },

  // Styling for the outer box
  boxStyle: {
    height: theme.spacing(60),
    paddingTop: theme.spacing(5),
    marginLeft: '-2px',
    marginRight: '-7px'
  },

  // Styling for the primary content box
  contentStyle: {
    height: theme.spacing(54),
    overflowY: 'auto'
  },

  paragraph: {
    marginBottom: theme.spacing(2)
  }
}))

/**
 * The main Karuna Connect panel showing info about user status, team status,
 * and more with functionality to update status.
 *
 * @param {object} props Properties for the component (See propTypes)
 * @returns {React.Element} The element to render for this component
 */
export default function ConnectMainPanel ({ hidden, onHide, waitToHide }) {
  // Deconstruct props and style class names
  const {
    paperRoot,
    panelHidden,
    panelRetracted,
    panelExpanded,
    contentStyle,
    boxStyle,
    paragraph
  } = useStyles()

  // Hover state of mouse
  const [mouseIsOver, setMouseIsOver] = useState(false)

  // Handle to the pending hide request (if any)
  const [hideTimeout, setHideTimeout] = useState(false)

  const [paragraphs, setParagraphs] = useState(['', ''])
  React.useEffect(() => {
    setParagraphs([
      lorem.generateParagraphs(1),
      lorem.generateParagraphs(1)
    ])
  }, [])

  // Function for queueing a hide request
  const hide = (immediate) => {
    if (onHide && !hidden) {
      if (immediate) {
        onHide()
      } else {
        const timeoutHandle = setTimeout(() => { onHide() }, waitToHide)
        setHideTimeout(timeoutHandle)
      }
    }
  }

  // Function for canceling a pending hide request
  const cancelHide = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      setHideTimeout(false)
    }
  }

  // Return the proper MUI elements
  return (
    <Paper
      data-testid="connectMainPanel"
      elevation={5}
      className={`${paperRoot} ${hidden ? panelHidden : (mouseIsOver ? panelExpanded : panelRetracted)}`}
      onMouseEnter={() => { setMouseIsOver(true); cancelHide() }}
      onMouseLeave={() => { setMouseIsOver(false); hide(false) }}
    >
      <PanelTitle title='Karuna Connect' arrow='right' onClose={() => { hide(true) }} />
      <div className={boxStyle}>
        <main className={contentStyle}>
          <ConnectMainContent />
        </main>
      </div>
    </Paper>
  )
}

ConnectMainPanel.propTypes = {
  /** Is the panel hidden */
  hidden: PropTypes.bool,

  /** Callback function when the panel should be hidden */
  onHide: PropTypes.func,

  /** Milliseconds to wait before hiding the panel */
  waitToHide: PropTypes.number
}

ConnectMainPanel.defaultProps = {
  hidden: false,
  onHide: null,
  waitToHide: 3000
}
