import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Paper, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ChatBubbleIcon from '@material-ui/icons/ChatBubbleOutlineOutlined'

import Emoji from '../ConnectComponents/Emoji.jsx'
import * as DBShapes from '../dataTypeShapes.js'

const EMOJI_UNKNOWN = <Emoji key='unknown' label='unknown' symbol='?' />
const useStyles = makeStyles((theme) => ({
  paperRoot: {
    backgroundColor: '#c5d9f1',
    textAlign: 'center',
    width: '45px',
    height: '125px'
  },
  gridRow: {
    width: '100%',
    padding: '4px',
    lineHeight: 1.4286
  },
  svgIcon: {
    fontSize: '24px'
  }
}))

export default function ThreeIconStatus (props) {
  // Compute custom styles
  const classes = useStyles()

  // Pick mood icon
  const [moodIcon, updateMoodIcon] = useState(EMOJI_UNKNOWN)
  useEffect(() => {
    if (props.userStatus) {
      for (let i = 0; i < props.emojiList.length; i++) {
        const entry = props.emojiList[i]
        if (entry._id === props.userStatus.currentAffectID && entry.active) {
          updateMoodIcon(<Emoji key={entry._id} label={entry.name} symbol={entry.characterCodes[0]} />)
          break
        }
      }
    }
  }, [props.emojiList, props.userStatus])

  // Setup the geometry state
  const [statusGeom, updateStatusGeom] = useState({ top: 0, left: 0, width: 0, height: 0 })
  useEffect(() => {
    if (props.top !== statusGeom.top || props.left !== statusGeom.left ||
        props.width !== statusGeom.width || props.height !== statusGeom.height) {
      updateStatusGeom({
        top: props.top,
        left: props.left,
        width: props.width,
        height: props.height
      })
    }
  }, [props.top, props.left, props.width, props.height])

  // Build collaboration icon from userStatus prop
  let collaborationType = <Emoji symbol='?' label='Loading' />
  if (props.userStatus?.collaboration) {
    collaborationType = <Emoji symbol='🧑‍🤝‍🧑' label='Open to Collaboration' />
  } else {
    collaborationType = <Emoji symbol='🧍' label='Solo Focused' />
  }

  // Render as a radial status icon
  if (props.radial) {
    const parentStyle = {
      position: 'absolute',
      whiteSpace: 'nowrap',
      ...statusGeom
    }

    const childStyle = {
      position: 'absolute',
      bottom: '-5px',
      transform: 'translateX(-30%)'
    }

    return (
      <div style={parentStyle}>
        <div style={childStyle}>A-B-C</div>
      </div>
    )
  }

  return (
    <Paper elevation={3} className={classes.paperRoot}>
      <Grid container>
        <Grid item className={classes.gridRow}>
          {collaborationType}
        </Grid>
        <Grid item className={classes.gridRow}>
          {moodIcon}
        </Grid>
        <Grid item className={classes.gridRow}>
          <Emoji symbol={<ChatBubbleIcon className={classes.svgIcon} />} label='Time to Respond' />
        </Grid>
      </Grid>
    </Paper>
  )
}

ThreeIconStatus.propTypes = {
  userStatus: PropTypes.shape(DBShapes.StatusObjectShape),
  emojiList: PropTypes.arrayOf(
    PropTypes.shape(DBShapes.AffectObjectShape)
  ),
  radial: PropTypes.bool,
  top: PropTypes.number,
  left: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number
}

// Need the geometry values to always be defined
ThreeIconStatus.defaultProps = {
  top: 0, left: 0, width: 0, height: 0
}
