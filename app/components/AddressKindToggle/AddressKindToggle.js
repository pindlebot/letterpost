import React from 'react'
import PlaceIcon from '@material-ui/icons/Place'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  icon: {
    marginRight: '10px'
  },
  toggleButtonGroup: {
    width: '100%',
    justifyContent: 'space-between',
    boxShadow: 'none',
    marginBottom: theme.spacing.unit
  },
  toggleButton: {
    flexBasis: '50%',
    width: '50%'
  }
})

const KIND = {
  RECIPIENT: 'RECIPIENT',
  SENDER: 'SENDER'
}

class AddressKindToggle extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <ToggleButtonGroup
        value={this.props.kind}
        exclusive
        onChange={this.props.handleAlignment}
        className={classes.toggleButtonGroup}
      >
        <ToggleButton
          value={KIND.RECIPIENT}
          className={classes.toggleButton}
          variant={'contained'}
          color={'primary'}
        >
          <PlaceIcon className={classes.icon} />
          <span>Recipient</span>
        </ToggleButton>
        <ToggleButton
          value={KIND.SENDER}
          className={classes.toggleButton}
          variant={'contained'}
          color={'primary'}
        >
          <PlaceIcon className={classes.icon} />
          <span>Sender</span>
        </ToggleButton>
      </ToggleButtonGroup>
    )
  }
}

export default withStyles(styles)(AddressKindToggle)
