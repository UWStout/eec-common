import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Button } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  captionTextStyle: {
    color: theme.palette.text.disabled
  },
  grdBoxStyle: {
    paddingLeft: `${theme.spacing(2)}px !important`
  },
  textBoxStyle: {
    paddingLeft: `${theme.spacing(3)}px !important`,
    paddingRight: `${theme.spacing(1)}px !important`
  }
}))

export default function CaptionedButton (props) {
  const { buttonText, onClick, children } = props
  const { captionTextStyle, gridBoxStyle, textBoxStyle } = useStyles()

  return (
    <Grid container spacing={1}>
      <Grid item className={gridBoxStyle} xs={12}>
        <Button variant="contained" fullWidth onClick={onClick}>
          {buttonText}
        </Button>
      </Grid>
      <Grid item className={textBoxStyle} xs={12}>
        <Typography className={captionTextStyle} variant="caption">
          {children}
        </Typography>
      </Grid>
    </Grid>
  )
}

CaptionedButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  children: PropTypes.node
}

CaptionedButton.defaultProps = {
  buttonText: 'ok',
  children: null
}
