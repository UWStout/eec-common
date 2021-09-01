import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { RecoilRoot } from 'recoil'

import { Typography } from '@material-ui/core'

import KarunaIcon from '../sharedComponents/KarunaIcon.jsx'
import SignUpForm from './SignUpForm.jsx'

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  margins: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6)
    }
  },
  logoStyle: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}))

export default function Register () {
  const classes = useStyles()

  return (
    <div className={classes.layout}>
      <div className={classes.logoStyle}>
        <KarunaIcon />
        <Typography component="h1" variant="h5">
          {'Create a New Karuna Account'}
        </Typography>
      </div>
      <RecoilRoot>
        <div className={classes.margins}>
          <SignUpForm />
        </div>
      </RecoilRoot>
    </div>
  )
}
