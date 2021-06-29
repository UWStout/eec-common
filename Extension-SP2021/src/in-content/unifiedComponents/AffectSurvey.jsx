import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import { List, Typography } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'

import SearchBar from 'material-ui-search-bar'
import Emoji from './Emoji.jsx'

import { AffectObjectShape, PrivacyObjectShape, StatusObjectShape } from './dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  }
}))

// DEBUG: Test data for recent emojis
const recentList = [
  '6008928508baff43187a74f0',
  '6008928508baff43187a7504',
  '6008928508baff43187a74f8'
]

// DEBUG: Test data for favorite emojis
const favList = [
  '6008928508baff43187a74f9',
  '6008928508baff43187a7502',
  '6008928508baff43187a7509'
]

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    },
    width: '100%'
  },
  expanded: {}
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56
    },
    width: '100%'
  },
  content: {
    '&$expanded': {
      margin: '12px 0'
    }
  },
  expanded: {}
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    width: '100%'
  }
}))(MuiAccordionDetails)

/**
 * affect survey pops up in the panel and in the bubble.
 **/
export default function AffectSurvey (props) {
  const { affectPrivacy, currentStatus, emojiList } = props
  const { root, heading } = useStyles()

  const [expanded, setExpanded] = useState('favorite')
  const [searchEmoji, setSearchEmoji] = useState('')

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const findEmoji = (emoji) => {

  }

  const onSelection = (affect) => {
    console.log(`[[AFFECT SURVEY]]: ${affect?._id} emoji selected`)
  }

  // Build list of emoji Elements
  const allEmojiElements = emojiList.map((emoji) => (
    <Emoji
      key={emoji._id}
      affect={emoji}
      handleClick={onSelection}
      button
      selected={(currentStatus.currentAffectID === emoji._id)}
    />
  ))

  const favEmojiElements = emojiList
    .filter((curEmoji) => (
      favList.some((favID) => (favID === curEmoji._id))
    ))
    .map((favEmoji) => (
      <Emoji
        key={favEmoji._id}
        affect={favEmoji}
        handleClick={onSelection}
        button
        selected={(currentStatus.currentAffectID === favEmoji._id)}
      />
    ))

  const recentEmojiElements = emojiList
    .filter((curEmoji) => (
      recentList.some((recentID) => (recentID === curEmoji._id))
    ))
    .map((recentEmoji) => (
      <Emoji
        key={recentEmoji._id}
        affect={recentEmoji}
        handleClick={onSelection}
        button
        selected={(currentStatus.currentAffectID === recentEmoji._id)}
      />
    ))

  return (
    <React.Fragment>
      <SearchBar
        value={searchEmoji}
        onClick={() => setExpanded('all')}
        onChange={(emoji) => setSearchEmoji(emoji)}
        onRequestSearch={() => findEmoji(searchEmoji)}
        placeholder={'emojis'}
      />
      <div className={root}>
        {/* First list item: favorite emojis */}
        <Accordion square expanded={expanded === 'favorite'} onChange={handleChange('favorite')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="favorite-emoji-content"
            id="favorite-emoji-header"
          >
            <Typography className={heading}>favorite</Typography>
          </AccordionSummary>
          <AccordionDetails id="favorite-emoji-content" aria-labelledby="favorite-emoji-header">
            {/* To-do: make this a list, and affect component inside listItem */}
            <List dense>
              {favEmojiElements}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Second item - recent emojis */}
        <Accordion square expanded={expanded === 'recent'} onChange={handleChange('recent')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="recent-emoji-content"
            id="recent-emoji-header"
          >
            <Typography className={heading}>recent</Typography>
          </AccordionSummary>
          <AccordionDetails id="recent-emoji-content" aria-labelledby="recent-emoji-header">
            <List dense>
              {recentEmojiElements}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* third item - all emojis */}
        <Accordion square expanded={expanded === 'all'} onChange={handleChange('all')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="all-emoji-content"
            id="all-emoji-header"
          >
            <Typography className={heading}>All emojis</Typography>
          </AccordionSummary>
          <AccordionDetails id="all-emoji-content" aria-labelledby="all-emoji-header">
            <List dense>
              {allEmojiElements}
            </List>
          </AccordionDetails>
        </Accordion>
      </div>
    </React.Fragment>
  )
}

AffectSurvey.propTypes = {
  emojiList: PropTypes.arrayOf(PropTypes.shape(AffectObjectShape)).isRequired,
  currentStatus: PropTypes.shape(StatusObjectShape).isRequired,
  affectPrivacy: PropTypes.shape(PrivacyObjectShape).isRequired
}
