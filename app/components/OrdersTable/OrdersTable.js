import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import OrdersToolbar from '../OrdersTableToolbar'
import Row from '../OrdersTableRow'
import { graphql, compose } from 'react-apollo'
import { DELETE_UPLOAD } from '../../graphql/mutations'
import { UPLOAD_QUERY } from '../../graphql/queries'

class OrdersTable extends React.Component {
  render () {
    const {
      orders: {
        orders
      },
      order: {
        data: {
          currentOrder
        }
      }
    } = this.props

    if (!(orders && orders.length)) {
      return false
    }

    return (
      <Paper elevation={0} className={this.props.classes.paper}>
        <OrdersToolbar
          open={currentOrder !== null}
          handleDelete={() => {
            // this.props.deleteUpload({
            //  input: {
            //    id: upload.id,
            //    name: upload.name,
            //    orders: upload.orders.map(o => o.id),
            // },
            // })
          }}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>File name</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Pages</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders && orders.map((order, index) =>
              <Row
                key={order.id}
                isSelected={order.id === (currentOrder && currentOrder.id)}
                handleRowSelection={this.selectOrder}
                order={order}
              />
            )}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

export default compose(
  graphql(UPLOAD_QUERY, {
    name: 'upload',
    skip: ownProps => !ownProps.order || ownProps.order.loading,
    options: ownProps => ({
      variables: {
        id: ownProps.order.data.currentOrder.id
      }
    })
  }),
  graphql(DELETE_UPLOAD, {
    props: ({ mutate }) => ({
      deleteUpload: variables => mutate({
        variables,
        optimisticResponse: {
          __typename: 'Mutation',
          deleteUpload: {
            __typename: 'Upload',
            ...variables
          }
        }
      })
    })
  })
)(OrdersTable)
