import React from 'react'
import PropTypes from 'prop-types'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import get from 'lodash.get'

function Row (props) {
  const {
    order,
    handleRowSelection,
    isSelected
  } = props

  const selected = isSelected

  return (
    <TableRow
      hover
      onClick={() => handleRowSelection(order)}
      role='checkbox'
      tabIndex='-1'
      selected={selected}
      aria-checked={selected}
    >
      <TableCell>
        <Checkbox checked={selected} />
      </TableCell>
      <TableCell>
        {order.upload.name}
      </TableCell>
      <TableCell>
        {get(order, ['contact', 'address', 'name'], '')}
      </TableCell>
      <TableCell>
        {order.upload.pages}
      </TableCell>
      <TableCell>
        {(order.charge.amount / 100).toFixed(2)}
      </TableCell>
      <TableCell>
        {order.status}
      </TableCell>

    </TableRow>
  )
}

export default Row
