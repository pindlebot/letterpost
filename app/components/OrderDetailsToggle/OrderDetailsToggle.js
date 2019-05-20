import React from 'react'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'

const OrderDetailsToggle = props => {
  const {
    updateOptions,
    checked,
    options,
    name
  } = props
  return (
    <Switch
      checked={checked}
      onChange={() => {
        const { options } = props
        const input = name === 'mailType'
          ? { id: options.id, [name]: checked ? 'USPS_STANDARD' : 'USPS_FIRST_CLASS' }
          : { id: options.id, [name]: !checked }
        updateOptions({ input })
      }}
      aria-label={name}
      disabled={!options}
    />
  )
}

OrderDetailsToggle.defaultProps = {
  checked: false,
  name: '',
  options: {}
}

OrderDetailsToggle.propTypes = {
  updateOptions: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  options: PropTypes.object,
  name: PropTypes.string
}

export default OrderDetailsToggle
