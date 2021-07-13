import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Debounce from 'debounce'

import { useRecoilValue } from 'recoil'
import { EmojiListState } from '../data/globalState.js'

import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemIcon, ListItemText, Divider, Collapse } from '@material-ui/core'
import { ExpandMore, ExpandLess, Favorite, History, Mood } from '@material-ui/icons'

import SearchBar from 'material-ui-search-bar'

import Emoji from './Emoji.jsx'
import PrivacyDialogue from './PrivacyDialogue.jsx'
import { PrivacyObjectShape, StatusObjectShape, DEFAULT } from '../data/dataTypeShapes.js'

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

// DEBUG: Test data for recent emojis
// const moodHistoryListTest = [
//   '6008928508baff43187a74f0',
//   '6008928508baff43187a7504',
//   '6008928508baff43187a74f8'
// ]

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
  const { affectPrivacy, onBubbleOpenSurvey, currentStatus, moodHistoryList, updateCurrentAffect, updatePrivacy, noInteraction } = props
  const { root, searchBar, listRoot, innerList, listItem } = useStyles()
  const [privacyDialogueOpen, setPrivacyDialogueOpen] = useState(false)
  const [selectedAffectID, setSelectedAffectID] = useState(currentStatus?.currentAffectID)

  // Subscribe to the global emojiList state
  const emojiList = useRecoilValue(EmojiListState)

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

  const update = async (newPrivacy) => {
    await updateCurrentAffect(selectedAffectID, newPrivacy?.private)
    await updatePrivacy(newPrivacy)
  }

  const onSelection = (affect) => {
    console.log(`[[AFFECT SURVEY]]: ${affect?._id} emoji selected`)
    setSelectedAffectID(affect?._id)
    if (affectPrivacy.prompt) {
      setPrivacyDialogueOpen(true)
    } else {
      update(affectPrivacy)
    }
  }

  // Build list of emoji Elements
  const filteredEmojis = (searchText === '' ? emojiList : searchFilter(emojiList, searchText))
  const allEmojiElements = filteredEmojis.map((emoji) => (
    <Emoji
      className={listItem}
      key={emoji._id}
      affect={emoji}
      handleClick={onBubbleOpenSurvey || onSelection}
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
        handleClick={onBubbleOpenSurvey || onSelection}
        button
        selected={(currentStatus.currentAffectID === favEmoji._id)}
      />
    ))

  const recentEmojiElements = filteredEmojis
    .filter((curEmoji) => (
      moodHistoryList.some((recentID) => (recentID === curEmoji._id))
    ))
    .map((recentEmoji) => (
      <Emoji
        className={listItem}
        key={recentEmoji._id}
        affect={recentEmoji}
        handleClick={onBubbleOpenSurvey || onSelection}
        button
        selected={(currentStatus.currentAffectID === recentEmoji._id)}
      />
    ))
  // sort the recentEmojiElements so that it is ordered by date
  // - moodHistoryList was already ordered, this sorts recentEmojiElements
  //   by its key so that it matches moodHistoryList
  recentEmojiElements.sort(function (a, b) {
    return moodHistoryList.indexOf(a.key) - moodHistoryList.indexOf(b.key)
  })

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <React.Fragment>
      {(privacyDialogueOpen && !onBubbleOpenSurvey)
        ? <PrivacyDialogue
            onUpdate={update}
            onClose={() => { setPrivacyDialogueOpen(false) }}
            privacy={affectPrivacy}
          />
        : <div className={root}>
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
          </div>}
    </React.Fragment>
  )
}

AffectSurveyList.propTypes = {
  moodHistoryList: PropTypes.arrayOf(PropTypes.string),
  currentStatus: PropTypes.shape(StatusObjectShape),
  affectPrivacy: PropTypes.shape(PrivacyObjectShape),
  onBubbleOpenSurvey: PropTypes.func,

  updateCurrentAffect: PropTypes.func.isRequired,
  updatePrivacy: PropTypes.func.isRequired,
  noInteraction: PropTypes.bool.isRequired
}

AffectSurveyList.defaultProps = {
  onBubbleOpenSurvey: null,
  moodHistoryList: [],
  currentStatus: DEFAULT.StatusObjectShape,
  affectPrivacy: DEFAULT.PrivacyObjectShape
}
