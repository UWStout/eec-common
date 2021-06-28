import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemIcon, ListItemText, Divider, Collapse, Typography } from '@material-ui/core'
import { ExpandMore, ExpandLess, Favorite, History } from '@material-ui/icons'

import SearchBar from 'material-ui-search-bar'
import Emoji from './Emoji.jsx'

import { AffectObjectShape, PrivacyObjectShape, StatusObjectShape } from './dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  nested: {
    // paddingLeft: theme.spacing(2)
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

/**
 * affect survey pops up in the panel and in the bubble.
 **/
export default function AffectSurveyList (props) {
  const { affectPrivacy, currentStatus, emojiList } = props
  const { root, nested } = useStyles()

  const [expanded, setExpanded] = useState(false)

  const [searchEmoji, setSearchEmoji] = useState('')
  const findEmoji = (emoji) => {

  }

  const toggleExpanded = (which) => {
    if (which !== expanded) {
      setExpanded(which)
    } else {
      setExpanded(false)
    }
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
        onClick={() => setExpanded(false)}
        onChange={(emoji) => setSearchEmoji(emoji)}
        onRequestSearch={() => findEmoji(searchEmoji)}
        placeholder={'emojis'}
      />
      <List dense>
        { /* Recent sub-list */
          recentEmojiElements?.length > 0 &&
          <React.Fragment>
            <ListItem button onClick={() => toggleExpanded('recent')} className={nested}>
              <ListItemIcon><History /></ListItemIcon>
              <ListItemText primary="Recent" />
              {expanded === 'recent' ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={expanded === 'recent'} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {recentEmojiElements}
              </List>
            </Collapse>
            <Divider />
          </React.Fragment>
        }

        { /* Favorites sub-list */
          favEmojiElements?.length > 0 &&
          <React.Fragment>
            <ListItem button onClick={() => toggleExpanded('favorites')} className={nested}>
              <ListItemIcon><Favorite /></ListItemIcon>
              <ListItemText primary="Favorites" />
              {expanded === 'favorites' ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={expanded === 'favorites'} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {favEmojiElements}
              </List>
            </Collapse>
            <Divider />
          </React.Fragment>
        }

        {/* List of all emojis */}
        {allEmojiElements}
      </List>
    </React.Fragment>
  )
}

AffectSurveyList.propTypes = {
  emojiList: PropTypes.arrayOf(PropTypes.shape(AffectObjectShape)).isRequired,
  currentStatus: PropTypes.shape(StatusObjectShape).isRequired,
  affectPrivacy: PropTypes.shape(PrivacyObjectShape).isRequired
}
