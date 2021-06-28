import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemIcon, ListItemText, Divider, Collapse } from '@material-ui/core'
import { ExpandMore, ExpandLess, Favorite, History, Mood } from '@material-ui/icons'

import SearchBar from 'material-ui-search-bar'
import Emoji from './Emoji.jsx'

import { AffectObjectShape, PrivacyObjectShape, StatusObjectShape } from './dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  nested: {
    // paddingLeft: theme.spacing(2)
  },
  searchBar: {
    paddingBottom: theme.spacing(2)
  },
  listRoot: {
    width: '100%',
    border: '1px solid lightgrey'
  },
  listItem: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  innerList: {
    overflowY: 'auto',

    // DEBUG: Can this be dynamic / responsive?
    maxHeight: '280px'
  }
}))

// DEBUG: Test data for recent emojis
const recentList = [
  '6008928508baff43187a74f0',
  '6008928508baff43187a7504',
  '6008928508baff43187a74f8',
  '6008928508baff43187a74f0',
  '6008928508baff43187a7504',
  '6008928508baff43187a74f8',
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
  const { root, searchBar, nested, listRoot, innerList, listItem } = useStyles()

  const [expanded, setExpanded] = useState('all')

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
      className={listItem}
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
        className={listItem}
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
        className={listItem}
        key={recentEmoji._id}
        affect={recentEmoji}
        handleClick={onSelection}
        button
        selected={(currentStatus.currentAffectID === recentEmoji._id)}
      />
    ))

  return (
    <div className={root}>
      <div className={searchBar}>
        <SearchBar
          value={searchEmoji}
          onClick={() => setExpanded('all')}
          onChange={(emoji) => setSearchEmoji(emoji)}
          onRequestSearch={() => findEmoji(searchEmoji)}
          placeholder={'search emojis'}
        />
      </div>
      <List dense className={listRoot}>
        { /* Recent sub-list */
          recentEmojiElements?.length > 0 &&
          <React.Fragment>
            <ListItem button onClick={() => toggleExpanded('recent')} className={nested}>
              <ListItemIcon><History /></ListItemIcon>
              <ListItemText primary="Recent" />
              {expanded === 'recent' ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={expanded === 'recent'} timeout="auto" unmountOnExit>
              <div className={innerList}>
                <List component="div" disablePadding>
                  {recentEmojiElements}
                </List>
              </div>
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
              <div className={innerList}>
                <List component="div" disablePadding>
                  {favEmojiElements}
                </List>
              </div>
            </Collapse>
            <Divider />
          </React.Fragment>
        }

        {/* List of all emojis */}
        <React.Fragment>
          <ListItem button onClick={() => toggleExpanded('all')} className={nested}>
            <ListItemIcon><Mood /></ListItemIcon>
            <ListItemText primary="All Moods" />
            {expanded === 'all' ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={expanded === 'all'} timeout="auto" unmountOnExit>
            <div className={innerList}>
              <List component="div" disablePadding>
                {allEmojiElements}
              </List>
            </div>
          </Collapse>
        </React.Fragment>
      </List>
    </div>
  )
}

AffectSurveyList.propTypes = {
  emojiList: PropTypes.arrayOf(PropTypes.shape(AffectObjectShape)).isRequired,
  currentStatus: PropTypes.shape(StatusObjectShape).isRequired,
  affectPrivacy: PropTypes.shape(PrivacyObjectShape).isRequired
}
