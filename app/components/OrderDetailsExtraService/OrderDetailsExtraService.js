import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

const EXTRA_SERVICE = [
  'NONE',
  'CERTIFIED',
  'REGISTERED'
]

class OrderDetailsExtraService extends React.Component {
  static defaultProps = {
    alignment: 'NONE'
  }

  static propTypes = {
    alignment: PropTypes.string,
    handleAlignment: PropTypes.func.isRequired,
    order: PropTypes.object
  }

  isDisabled = (service) => {
    return service !== 'NONE' && this.props.order?.options?.mailType === 'USPS_STANDARD'
  }

  render () {
    const { classes } = this.props
    return (
      <FormControl component={'fieldset'}>
        <FormLabel component={'legend'} className={classes.formLabel}>Mail Type</FormLabel>
        <ToggleButtonGroup
          value={this.props.alignment || 'NONE'}
          exclusive
          onChange={this.props.handleAlignment}
          classes={{
            root: classes.toggleButton
          }}
        >
          {EXTRA_SERVICE.map(service => (
            <ToggleButton value={service} disabled={this.isDisabled(service)} key={service}>
              {service}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormControl>
    )
  }
}

const styles = {
  toggleButton: {
    boxShadow: 'none'
  },
  formLabel: {
    height: 48,
    lineHeight: '48px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#586069'
  }
}

export default withStyles(styles)(OrderDetailsExtraService)
