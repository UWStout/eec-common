import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Debounce from 'debounce'

import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemIcon, ListItemText, Divider, Collapse } from '@material-ui/core'
import { ExpandMore, ExpandLess, Favorite, History, Mood } from '@material-ui/icons'

import SearchBar from 'material-ui-search-bar'

import Emoji from './Emoji.jsx'
import PrivacyDialog from './PrivacyDialog.jsx'

import { AffectObjectShape, PrivacyObjectShape, StatusObjectShape } from './dataTypeShapes.js'

import { makeLogger } from '../../util/Logger.js'
const LOG = makeLogger('CONNECT Affect Survey', 'pink', 'black')

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    width: '100%'
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
  '6008928508baff43187a74f8'
]

// DEBUG: Test data for favorite emojis
const favList = [
  '6008928508baff43187a74f9',
  '6008928508baff43187a7502',
  '6008928508baff43187a7509'
]

// Function to filter a list of affects by given text
function searchFilter (fullList, searchText) {
  return fullList.filter((curItem) => {
    const text = searchText.toLowerCase()
    return curItem.name.toLowerCase().includes(text) || curItem.description.toLowerCase().includes(searchText)
  })
}

/**
 * affect survey pops up in the panel and in the bubble.
 **/
export default function AffectSurveyList (props) {
  const { affectPrivacy, onDismissSurvey, currentStatus, emojiList, updateCurrentAffect, updatePrivacy, noInteraction } = props
  const { root, searchBar, listRoot, innerList, listItem } = useStyles()

  const [searchText, setSearchText] = useState('')
  const onSearchTextChanged = Debounce((newText) => {
    LOG('Search text changed:', newText)
    setSearchText(newText)
  }, 200)

  const [expanded, setExpanded] = useState('all')
  const toggleExpanded = (which) => {
    if (which !== expanded) {
      setExpanded(which)
    } else {
      setExpanded(false)
    }
  }

  const [selectedAffectID, setSelectedAffectID] = useState(currentStatus?.currentAffectID)
  const updateAndClose = async (newPrivacy) => {
    if (onDismissSurvey) {
      await updateCurrentAffect(selectedAffectID, newPrivacy.private)
      await updatePrivacy(newPrivacy)
      onDismissSurvey()
    }
  }

  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false)
  const privacyDialogClosed = (canceled, newPrivacy) => {
    LOG('Privacy Dialog Dismissed:', newPrivacy)
    setPrivacyDialogOpen(false)
    if (!canceled) {
      updateAndClose(newPrivacy)
    }
  }

  const onSelection = (affect) => {
    console.log(`[[AFFECT SURVEY]]: ${affect?._id} emoji selected`)
    setSelectedAffectID(affect?._id)
    if (affectPrivacy.prompt) {
      setPrivacyDialogOpen(true)
    } else {
      updateAndClose(affectPrivacy)
    }
  }

  // Build list of emoji Elements
  const filteredEmojis = (searchText === '' ? emojiList : searchFilter(emojiList, searchText))
  const allEmojiElements = filteredEmojis.map((emoji) => (
    <Emoji
      className={listItem}
      key={emoji._id}
      affect={emoji}
      handleClick={onSelection}
      button
      selected={(currentStatus.currentAffectID === emoji._id)}
    />
  ))

  const favEmojiElements = filteredEmojis
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

  const recentEmojiElements = filteredEmojis
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
      <PrivacyDialog isOpen={privacyDialogOpen} onDialogClose={privacyDialogClosed} privacy={affectPrivacy} />
      <div className={searchBar}>
        <SearchBar
          value={searchText}
          onClick={() => setExpanded('all')}
          onChange={onSearchTextChanged}
          placeholder={'search emojis'}
          disabled={noInteraction}
        />
      </div>
      <List dense className={listRoot}>
        { /* Recent sub-list */
          recentEmojiElements?.length > 0 && searchText === '' &&
          <React.Fragment>
            <ListItem button onClick={() => toggleExpanded('recent')}>
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
          favEmojiElements?.length > 0 && searchText === '' &&
          <React.Fragment>
            <ListItem button onClick={() => toggleExpanded('favorites')}>
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
          <ListItem button onClick={() => toggleExpanded('all')}>
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
  affectPrivacy: PropTypes.shape(PrivacyObjectShape).isRequired,
  updateCurrentAffect: PropTypes.func.isRequired,
  updatePrivacy: PropTypes.func.isRequired,
  noInteraction: PropTypes.bool.isRequired,
  onDismissSurvey: PropTypes.func
}

AffectSurveyList.defaultProps = {
  onDismissSurvey: null
}