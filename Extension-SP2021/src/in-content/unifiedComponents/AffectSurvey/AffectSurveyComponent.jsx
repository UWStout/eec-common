import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { debounce } from 'debounce'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { LastSelectedAffectIDState } from '../data/globalSate/appState.js'
import { AffectListState, DisabledAffectsListState } from '../data/globalSate/teamState.js'
import { AffectHistoryListState, FavoriteAffectsListState, UserAffectIDState, PrivacyPrefsState } from '../data/globalSate/userState.js'

import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemIcon, ListItemText, Divider, Collapse, Grid } from '@material-ui/core'
import { ExpandMore, ExpandLess, Favorite, History, Mood } from '@material-ui/icons'

import TunneledSearchBar from '../Shared/TunneledSearchBar.jsx'
import Emoji from '../Shared/Emoji.jsx'

import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('Affect Survey Activity', 'pink', 'black')

const useStyles = makeStyles((theme) => ({
  searchBarStyle: {
    width: '100%'
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
      (curItem.description && curItem.description.toLowerCase().includes(text))
    )
  })
}

/**
 * affect survey pops up in the panel and in the bubble.
 **/
const AffectSurveyComponent = React.forwardRef((props, ref) => {
  // Make/Deconstruct the props and style class names
  const { noInteraction, selectionCallback } = props
  const { listRoot, innerList, listItem, searchBarStyle } = useStyles()

  // Subscribe to changes in global states (GLOBAL STATE)
  const emojiList = useRecoilValue(AffectListState)
  const moodHistoryList = useRecoilValue(AffectHistoryListState)
  const favoriteAffectsList = useRecoilValue(FavoriteAffectsListState)
  const disabledAffects = useRecoilValue(DisabledAffectsListState)

  // Values and mutator functions for global state (GLOBAL STATE)
  const userAffectID = useRecoilValue(UserAffectIDState)
  const setLastSelectedAffectID = useSetRecoilState(LastSelectedAffectIDState)
  const affectPrivacy = useRecoilValue(PrivacyPrefsState)

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
    if (selectionCallback) {
      selectionCallback(affect, affectPrivacy)
    }
  }

  // Filter out globally inactive and team-disabled emojis
  const enabledEmojis = emojiList.filter((emoji) => (
    emoji.active && !disabledAffects.some((disabledEmojiID) => (disabledEmojiID === emoji._id))
  ))

  // Filter list of emojis by searchText (if any)
  const filteredEmojis = (searchText === '' ? enabledEmojis : searchFilter(enabledEmojis, searchText))

  // Build the COMPLETE list of Emoji elements
  const allEmojiElements = filteredEmojis.map((emoji) => (
    <Emoji
      className={listItem}
      key={emoji._id}
      affect={emoji}
      handleClick={onSelection}
      button
      selected={(userAffectID === emoji._id)}
      favoriteList={favoriteAffectsList}
    />
  ))

  // Build the FAVORITES list of emoji elements
  const favEmojiElements = filteredEmojis
    .filter((curEmoji) => (
      favoriteAffectsList?.some((favID) => (favID === curEmoji._id))
    ))
    .map((favEmoji) => (
      <Emoji
        className={listItem}
        key={favEmoji._id}
        affect={favEmoji}
        handleClick={onSelection}
        button
        selected={(userAffectID === favEmoji._id)}
        favoriteList={favoriteAffectsList}
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
        favoriteList={favoriteAffectsList}
      />
    ))

  // Show affect survey
  return (
    <Grid
      ref={ref}
      role={'region'}
      aria-label={'Affect Survey'}
      container
      spacing={1}
    >

      {/* For searching through the possible moods */}
      <Grid item xs={12} gutterBottom>
        <TunneledSearchBar
          role={'search'}
          value={searchText}
          onClick={() => { setExpanded('all') }}
          onChange={onSearchTextChanged}
          placeholder={'search emojis'}
          disabled={noInteraction}
          aria-label={'Affect Search Box'}
          className={searchBarStyle}
        />
      </Grid>
      <Grid item xs={12}>

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

AffectSurveyComponent.displayName = 'AffectSurveyComponent'

AffectSurveyComponent.propTypes = {
  noInteraction: PropTypes.bool,
  selectionCallback: PropTypes.func
}

AffectSurveyComponent.defaultProps = {
  noInteraction: false,
  selectionCallback: null
}

export default AffectSurveyComponent
