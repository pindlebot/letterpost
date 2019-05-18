// @flow weak

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center'
  },
  avatar: {
    margin: 10
  },
  bigAvatar: {
    width: 60,
    height: 60
  }
}

const createAvatarUrl = () => 'https://avatar.tobi.sh/cj75w3w9w00013i6243n238zr'

const ProfileAvatar = props => {
  const { classes } = props
  return (
    <div className={classes.row}>
      <Avatar alt='Remy Sharp' src={createAvatarUrl()} className={classes.avatar} />
    </div>
  )
}

ProfileAvatar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ProfileAvatar)
