import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import get from 'lodash.get'

const Spacer = () => <span style={{ width: '20px' }} />

function SelectMenuItems (props) {
  const {
    orders,
    isSelected,
    handleMenuItemClick
  } = props

  if (!orders) return false
  return (
    <div>{orders.map(order =>
      (<MenuItem
        key={order.id}
        selected={isSelected(order)}
        onClick={e => handleMenuItemClick(e, order)}
      >
        <Checkbox
          checked={isSelected(order)}
          tabIndex={-1}
          disableRipple
        />
        <Spacer />
        {get(order, ['upload', 'name']) || 'Not found'}

      </MenuItem>)
    )}</div>
  )
}

export default SelectMenuItems
