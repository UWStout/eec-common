import React from 'react'

import { Typography } from '@material-ui/core'

export function Observation () {
  return (
    <Typography aria-label='title' variant='body2'>
      {'Stating an observation means stating what is actually happening in a situation: what  are  we  observing  others  saying  or  doing that is either enriching or not enriching our  life? The trick is to be able to articulate this observation without introducing any judgment or evaluation—to simply say what people are doing that we either like or don\'t like.'}
      <br />
      <br />
      {'For more information, check out this link: '}
      <a target="_blank" href="https://www.cnvc.org/training/resource/book-chapter-1" rel="noreferrer">
        {'The Center for Nonviolent Communication'}
      </a>
    </Typography>
  )
}

export function Feeling () {
  return (
    <Typography aria-label='title' variant='body2'>
      {'Stating a feeling means explaining how we feel when we observe some action: are we hurt, scared, joyful, amused, irritated?'}
      <br />
      <br />
      {'For more information, check out this link: '}
      <a target="_blank" href="https://www.cnvc.org/training/resource/book-chapter-1" rel="noreferrer">
        {'The Center for Nonviolent Communication'}
      </a>
    </Typography>)
}

export function Need () {
  return (
    <Typography aria-label='title' variant='body2'>
      {'Stating a need means saying what needs of ours are connected to the feelings we have identified.'}
      <br />
      <br />
      {'For more information, check out this link: '}
      <a target="_blank" href="https://www.cnvc.org/training/resource/book-chapter-1" rel="noreferrer">
        {'The Center for Nonviolent Communication'}
      </a>
    </Typography>)
}

export function Request () {
  return (
    <Typography aria-label='title' variant='body2'>
      {'Stating a request means addressing what we are wanting from the other person that would enrich our lives or make life more wonderful for us.'}
      <br />
      <br />
      {'For more information, check out this link: '}
      <a target="_blank" href="https://www.cnvc.org/training/resource/book-chapter-1" rel="noreferrer">
        {'The Center for Nonviolent Communication'}
      </a>
    </Typography>)
}
