import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import NVCInfoSection from './NVCInfoSection.jsx'

const useStyles = makeStyles((theme) => ({
  itemStyle: {
    display: 'flex',
    alignItems: 'center'
  },
  observation: {
    color: 'grey'
  },
  observationItem: {
    color: '#4fa6ff'
  },
  clickable: {
    cursor: 'pointer'
  }
}))

export default function ListNVCElements (props) {
  const { observations, fromBubble } = props
  const classes = useStyles()

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [title, setTitle] = useState('')

  // Callback to switch feedback to 'details' of some sort
  function openDetails (title) {
    setTitle(title)
    setIsDetailsOpen(true)
    if (fromBubble) window.dispatchEvent(new CustomEvent('resize'))
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <React.Fragment>
      {isDetailsOpen
        ? <NVCInfoSection title={title} onReturn={() => setIsDetailsOpen(false)} />
        : <Grid item className={`${classes.observationItem} ${classes.clickable}`}>
          <ul >
            {observations.map((observation, i) => (
              <li key={i} onClick={() => { openDetails(observation) }}>{observation}</li>
            ))}
          </ul>
          <p>
            {'What other elements could I use?'}
            <br />
            {'More about NVC'}
          </p>
          </Grid>}
    </React.Fragment>
  )
}

ListNVCElements.propTypes = {
  observations: PropTypes.arrayOf(PropTypes.string),
  fromBubble: PropTypes.bool
}

ListNVCElements.defaultProps = {
  observations: ['Observation', 'Feeling', 'Need', 'Request'],
  fromBubble: false
}
