import React from 'react'
import PropTypes from 'prop-types'
import FileIcon from '@material-ui/icons/InsertDriveFile'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItem from '@material-ui/core/ListItem'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import SelectMenuItems from '../SelectUploadMenu'
import get from 'lodash.get'
import uuid from 'uuid/v4'

const styles = theme => ({
  wrapper: {
    width: '100%'
  }
})

class SelectUpload extends React.Component {
  state = {
    anchorEl: undefined,
    open: false,
    selected: null
  }

  handleClickListItem = (e) => {
    const data = get(this.props, ['_select_upload_orders'])
    this.setState({ open: true, anchorEl: e.currentTarget }, () => {
      data.refetch()
    })
  }

  componentDidMount = () => {
    const data = get(this.props, ['_contacts_contacts'])
    data.refetch()
  }

  handleMenuItemClick = (e, order) => {
    const selected = this.isSelected(order)

    const { contact } = this.props

    this.props.updateOrder({
      input: {
        contact: selected ? null : contact.id,
        id: order.id
      }
    })
    this.setState({ open: false })
  }

  handleRequestClose = () => {
    this.setState({ open: false })
  }

  renderSecondaryText = () => {
    const orders = get(this.props, ['_select_upload_orders', 'orders'])
    if (!orders) return ''
    return orders.filter(order => this.isSelected(order))
      .map(order => get(order, ['upload', 'name']))
      .join(', ')
  }

  getOrders = () => get(this.props, ['_select_upload_orders', 'orders'])

  isSelected = order => get(order, ['contact', 'id']) === get(this.props.contact, ['id'])

  renderMenuItems = () => {
    const orders = get(this.props, ['_select_upload_orders', 'orders'])
    // const uploads = get(this.props, ['_select_upload_uploads', 'uploads'])
    if (!orders) return ''
    return orders.map(order =>
      (<MenuItem
        key={order.id}
        selected={this.isSelected(order)}
        onClick={e => this.handleMenuItemClick(e, order)}
        classes={{
          root: this.props.classes.menuItemRoot,
          selected: this.props.classes.menuItemSelected
        }}
      >
        {get(order, ['upload', 'name']) || 'Not found'}
      </MenuItem>)
    )
  }

  render () {
    const { classes, contact } = this.props
    if (!contact) {
      return false
    }
    return (
      <div className={classes.wrapper}>
        <List>
          <ListItem
            // disableGutters
            button
            aria-haspopup='true'
            aria-controls='lock-menu'
            aria-label='Upload'
            onClick={this.handleClickListItem}
          >
            <ListItemIcon><FileIcon /></ListItemIcon>
            <ListItemText
              primary='Documents'
              secondary={this.renderSecondaryText()}
            />
          </ListItem>
        </List>
        <Menu
          id='lock-menu'
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          <SelectMenuItems
            classes={this.props.classes}
            orders={this.getOrders()}
            isSelected={this.isSelected}
            handleMenuItemClick={this.handleMenuItemClick}
          />

        </Menu>
      </div>
    )
  }
}

SelectUpload.propTypes = {
  classes: PropTypes.object.isRequired,
  contact: PropTypes.object,
  data: PropTypes.object,
  updateOrder: PropTypes.func
}

const SelectUploadWithStyles = withStyles(styles)(SelectUpload)

const ordersQuery = gql`
  query {
    orders {
      ...OrderFields
      contact {
        id
      }
      uploads {
        ...UploadFields
      }
    }
  }
  ${fragments.order}
  ${fragments.upload}
`

const updateOrder = gql`
  mutation updateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      id
      contact {
        id
        orders {
          id
        }
      }
      uploads {
        ...UploadFields
      }
    }
  }
  ${fragments.upload}
`

export default compose(
  graphql(ordersQuery, {
    name: '_select_upload_orders',
    skip: ownProps => !ownProps.data
  }),
  graphql(updateOrder, {
    props: ({ mutate }) => ({
      updateOrder: variables => mutate({
        variables,
        optimisticResponse: {
          __typename: 'Mutation',
          updateOrder: {
            __typename: 'Order',
            id: uuid(),
            ...variables
          }
        }
      })
    })
  })
)(SelectUploadWithStyles)
