import React from 'react'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'

const OrderDetailsToggle = props => {
  const {
    updateOptions,
    checked,
    order,
    name
  } = props
  return (
    <Switch
      checked={checked}
      onChange={() => {
        const { order: { options } } = props
        const input = name === 'mailType'
          ? { id: options.id, [name]: checked ? 'USPS_STANDARD' : 'USPS_FIRST_CLASS' }
          : { id: options.id, [name]: !checked }
        updateOptions({ input })
      }}
      aria-label={name}
      disabled={order === null}
    />
  )
}

OrderDetailsToggle.defaultProps = {
  checked: false,
  name: '',
  order: null
}

OrderDetailsToggle.propTypes = {
  updateOptions: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  order: PropTypes.object,
  name: PropTypes.string
}

export default OrderDetailsToggle
