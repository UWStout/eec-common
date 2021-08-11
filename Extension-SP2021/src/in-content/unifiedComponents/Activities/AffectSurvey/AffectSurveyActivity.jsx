import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { debounce } from 'debounce'

import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import * as STATE from '../../data/globalState.js'

import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemIcon, ListItemText, Divider, Collapse, Grid } from '@material-ui/core'
import { ExpandMore, ExpandLess, Favorite, History, Mood } from '@material-ui/icons'

import SearchBar from 'material-ui-search-bar'

import Emoji from '../../Shared/Emoji.jsx'

import { ACTIVITIES } from '../Activities.js'

import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('Affect Survey Activity', 'pink', 'black')

const useStyles = makeStyles((theme) => ({
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
    maxHeight: '280px'
  }
}))

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
const AffectSurveyActivity = React.forwardRef((props, ref) => {
  // Make/Deconstruct the props and style class names
  const { noInteraction } = props
  const { listRoot, innerList, listItem } = useStyles()

  // Subscribe to changes in global states (GLOBAL STATE)
  let emojiList = useRecoilValue(STATE.AffectListState)
  const moodHistoryList = useRecoilValue(STATE.AffectHistoryListState)
  const favoriteAffectsList = useRecoilValue(STATE.FavoriteAffectsListState)
  const disabledAffects = useRecoilValue(STATE.DisabledAffectsListState)

  // Values and mutator functions for global state (GLOBAL STATE)
  const [userAffectID, setUserAffectID] = useRecoilState(STATE.UserAffectIDState)
  const setLastSelectedAffectID = useSetRecoilState(STATE.LastSelectedAffectIDState)
  const affectPrivacy = useRecoilValue(STATE.PrivacyPrefsState)

  // Global activity management
  const pushActivity = useSetRecoilState(STATE.PushActivityState)
  const popActivity = useSetRecoilState(STATE.PopActivityState)

  // Current search text (if any)
  const [searchText, setSearchText] = useState('')
  const onSearchTextChanged = debounce((newText) => {
    LOG('Search text changed:', newText)
    setSearchText(newText)
  }, 200)

  // Clear any pending event before un-mounting
  useEffect(() => {
    return () => {
      onSearchTextChanged.clear()
    }
  }, [onSearchTextChanged])

  // Which list option (favorites, recent, all) is expanded
  const [expanded, setExpanded] = useState('all')
  const toggleExpanded = (which) => {
    if (which !== expanded) {
      setExpanded(which)
    } else {
      setExpanded(false)
    }
  }

  // Called when the user clicks on an affect. May:
  // - Show the privacy preferences prompt
  // - Fully commit and update mood
  const onSelection = (affect) => {
    setLastSelectedAffectID(affect?._id)
    if (affectPrivacy.prompt) {
      pushActivity(ACTIVITIES.PRIVACY_PROMPT.key)
    } else {
      setUserAffectID(affect?._id)
      popActivity(ACTIVITIES.AFFECT_SURVEY.key)
    }
  }

  // filter out the disabled emojis from the emoji list
  emojiList = emojiList.filter((emoji) => (
    disabledAffects.some((badEmojis) => (badEmojis !== emoji._id))
  ))

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
      favoriteAffectsList.some((favID) => (favID === curEmoji._id))
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
      moodHistoryList.some((recent) => (recent.affectID === curEmoji._id))
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

  // Show affect survey
  return (
    <Grid
      ref={ref}
      role={'region'}
      aria-label={'Affect Survey'}
      // className={root}
      container
      spacing={1}
    >

      {/* For searching through the possible moods */}
      <Grid item>
        <SearchBar
          role={'search'}
          value={searchText}
          onClick={() => { setExpanded('all') }}
          onChange={onSearchTextChanged}
          placeholder={'search emojis'}
          disabled={noInteraction}
          aria-label={'Affect Search Box'}
        />
      </Grid>
      <Grid item>

        <List dense className={listRoot}>
          {/* Recent sub-list */}
          {recentEmojiElements?.length > 0 && searchText === '' &&
          <React.Fragment>
            <ListItem
              aria-expanded={(expanded === 'recent') ? 'true' : 'false'}
              aria-label={'Expand Recent Emojis'}
              button
              onClick={() => toggleExpanded('recent')}
            >
              <ListItemIcon><History /></ListItemIcon>
              <ListItemText primary="Recent" />
              {expanded === 'recent' ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={expanded === 'recent'}
              timeout="auto"
              unmountOnExit
            >
              <div className={innerList}>
                <List
                  role={'list'}
                  component="div"
                  disablePadding
                  aria-label={'Recent Emojis'}
                >
                  {recentEmojiElements}
                </List>
              </div>
            </Collapse>
            <Divider />
          </React.Fragment>}

          { /* Favorites sub-list */}
          {favEmojiElements?.length > 0 && searchText === '' &&
          <React.Fragment>
            <ListItem
              aria-expanded={(expanded === 'favorites') ? 'true' : 'false'}
              aria-label={'Expand Favorite Emojis'}
              button
              onClick={() => toggleExpanded('favorites')}
            >
              <ListItemIcon><Favorite /></ListItemIcon>
              <ListItemText primary="Favorites" />
              {expanded === 'favorites' ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={expanded === 'favorites'} timeout="auto" unmountOnExit>
              <div className={innerList}>
                <List aria-label={'Favorite Emojis'} role={'list'} component="div" disablePadding>
                  {favEmojiElements}
                </List>
              </div>
            </Collapse>
            <Divider />
          </React.Fragment>}

          {/* List of all emojis */}
          <React.Fragment>
            <ListItem
              aria-label={'Expand All Emojis'}
              aria-expanded={(expanded === 'all') ? 'true' : 'false'}
              button onClick={() => toggleExpanded('all')}
            >
              <ListItemIcon><Mood /></ListItemIcon>
              <ListItemText primary="All Moods" />
              {expanded === 'all' ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={expanded === 'all'}
              timeout="auto"
              unmountOnExit
            >
              <div className={innerList}>
                <List aria-label={'All Emojis'} role={'list'} component="div" disablePadding>
                  {allEmojiElements}
                </List>
              </div>
            </Collapse>
          </React.Fragment>
        </List>
      </Grid>

    </Grid>
  )
})

AffectSurveyActivity.displayName = 'AffectSurveyActivity'

AffectSurveyActivity.propTypes = {
  noInteraction: PropTypes.bool
}

AffectSurveyActivity.defaultProps = {
  noInteraction: false
}

export default AffectSurveyActivity
