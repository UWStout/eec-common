import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Debounce from 'debounce'

import { useRecoilValue, useRecoilState } from 'recoil'
import * as STATE from '../data/globalState.js'

import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemIcon, ListItemText, Divider, Collapse } from '@material-ui/core'
import { ExpandMore, ExpandLess, Favorite, History, Mood } from '@material-ui/icons'

import SearchBar from 'material-ui-search-bar'

import Emoji from './Emoji.jsx'
import PrivacyDialog from './PrivacyDialog.jsx'

import { makeLogger } from '../../../util/Logger.js'
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

// DEBUG: Test data for favorite emojis
const favList = [
  '6008928508baff43187a74f9',
  '6008928508baff43187a7502',
  '6008928508baff43187a7509'
]

// Function to filter a list of affects by given text
function searchFilter (fullList, searchText) {
  if (!searchText || searchText === '') {
    return fullList
  }

  return fullList.filter((curItem) => {
    const text = searchText.toLowerCase()
    return (
      (curItem.name && curItem.name.toLowerCase().includes(text)) ||
      (curItem.description && curItem.description.toLowerCase().includes(searchText))
    )
  })
}

/**
 * affect survey pops up in the panel and in the bubble.
 **/
export default function AffectSurveyList (props) {
  // Make/Deconstruct the props and style class names
  const { onBubbleOpenSurvey, noInteraction } = props
  const { root, searchBar, listRoot, innerList, listItem } = useStyles()

  // Subscribe to changes in global states (GLOBAL STATE)
  const emojiList = useRecoilValue(STATE.AffectListState)
  const moodHistoryList = useRecoilValue(STATE.AffectHistoryListState)

  // Values and mutator functions for global state (GLOBAL STATE)
  const [affectPrivacy, setPrivacy] = useRecoilState(STATE.PrivacyPrefsStateSetter)
  const [userAffectID, setUserAffectID] = useRecoilState(STATE.UserAffectIDState)
  const [selectedAffectID, setSelectedAffectID] = useRecoilState(STATE.SelectedAffectSurveyState)

  // Visibility of the privacy dialog
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false)

  // Current search text (if any)
  const [searchText, setSearchText] = useState('')
  const onSearchTextChanged = Debounce((newText) => {
    LOG('Search text changed:', newText)
    setSearchText(newText)
  }, 200)

  // Which list option (favorites, recent, all) is expanded
  const [expanded, setExpanded] = useState('all')
  const toggleExpanded = (which) => {
    if (which !== expanded) {
      setExpanded(which)
    } else {
      setExpanded(false)
    }
  }

  // Used to commit the final selection to global state / database
  const update = (newPrivacy) => {
    setUserAffectID(selectedAffectID)
    setPrivacy(newPrivacy)
  }

  // Used to chancel the selection and revert back
  const cancel = () => {
    setSelectedAffectID(userAffectID)
  }

  // Called when the user clicks on an affect. May:
  // - Show the privacy preferences prompt
  // - Fully commit and update mood
  const onSelection = (affect) => {
    console.log(`[[AFFECT SURVEY]]: ${affect?._id} emoji selected`)
    setSelectedAffectID(affect?._id)
    if (affectPrivacy.prompt) {
      if (onBubbleOpenSurvey) onBubbleOpenSurvey()
      else setPrivacyDialogOpen(true)
    } else {
      update(affectPrivacy)
    }
  }

  // Build list of Emoji elements filtered by search text
  const filteredEmojis = (searchText === '' ? emojiList : searchFilter(emojiList, searchText))
  const allEmojiElements = filteredEmojis.map((emoji) => (
    <Emoji
      className={listItem}
      key={emoji._id}
      affect={emoji}
      handleClick={onSelection}
      button
      selected={(userAffectID === emoji._id)}
    />
  ))

  // Build the Emoji elements for the favorites only
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
        selected={(userAffectID === favEmoji._id)}
      />
    ))

  // Build the Emoji elements for the recent moods only
  const recentEmojiElements = filteredEmojis
    .filter((curEmoji) => (
      moodHistoryList.some((recentID) => (recentID === curEmoji._id))
    ))
    .map((recentEmoji) => (
      <Emoji
        className={listItem}
        key={recentEmoji._id}
        affect={recentEmoji}
        handleClick={onSelection}
        button
        selected={(userAffectID === recentEmoji._id)}
      />
    ))

  // Sort the recentEmojiElements so that it is ordered by date
  // - moodHistoryList was already ordered, this sorts recentEmojiElements
  //   by its key so that it matches moodHistoryList
  recentEmojiElements.sort(function (a, b) {
    return moodHistoryList.indexOf(a.key) - moodHistoryList.indexOf(b.key)
  })

  // If the privacy dialog is visible, show it and return
  if (privacyDialogOpen && !onBubbleOpenSurvey) {
    return (
      <PrivacyDialog
        onCancel={cancel}
        onUpdate={update}
        onClose={() => { setPrivacyDialogOpen(false) }}
        privacy={affectPrivacy}
      />
    )
  }

  // Otherwise, show full affect survey
  return (
    <div className={root}>
      {/* For searching through the possible moods */}
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
        {/* Recent sub-list */}
        {recentEmojiElements?.length > 0 && searchText === '' &&
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
          </React.Fragment>}

        { /* Favorites sub-list */}
        {favEmojiElements?.length > 0 && searchText === '' &&
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
          </React.Fragment>}

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
  onBubbleOpenSurvey: PropTypes.func,
  noInteraction: PropTypes.bool
}

AffectSurveyList.defaultProps = {
  onBubbleOpenSurvey: null,
  noInteraction: false
}
