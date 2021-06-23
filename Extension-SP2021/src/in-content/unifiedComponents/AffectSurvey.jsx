import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import { List, Typography } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'

import SearchBar from 'material-ui-search-bar'
import Emoji from './Emoji.jsx'
import { retrieveAffectList } from './backgroundHelper.js'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  }
}))

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
export default function AffectSurvey ({ privacy }) {
  const { root, heading } = useStyles()
  const [expanded, setExpanded] = useState('favorite')
  const [searchEmoji, setSearchEmoji] = useState('')
  const [emojiList, setEmojiList] = useState([])

  useEffect(() => {
    const getEmojis = async () => {
      const emojisFromServer = await retrieveAffectList()
      setEmojiList(emojisFromServer)
    }

    getEmojis()
  }, [])

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const findEmoji = (emoji) => {

  }

  function generate (element) {
    return emojiList.map((emoji) =>
      React.cloneElement(element, {
        key: emoji._id,
        characterCode: emoji.characterCodes,
        name: emoji.name,
        description: emoji.description
      })
    )
  }

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
              {generate(
                <Emoji />
              )}
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
          <AccordionDetails id="favorite-emoji-content" aria-labelledby="favorite-emoji-header">
            <List dense>
              {generate(
                <Emoji />
              )}
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
          <AccordionDetails id="favorite-emoji-content" aria-labelledby="favorite-emoji-header">
            <List dense>
              {generate(
                <Emoji />
              )}
            </List>
          </AccordionDetails>
        </Accordion>
      </div>
    </React.Fragment>
  )
}

AffectSurvey.propTypes = {

}
