/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import OrderDetailsToggle from '../OrderDetailsToggle'
import InvertColors from '@material-ui/icons/InvertColors'
import Print from '@material-ui/icons/Print'
import { Mutation } from 'react-apollo'
import { UPDATE_OPTIONS, ORDER_QUERY } from '../../graphql/mutations'
import MailIcon from '@material-ui/icons/Mail'
import OrderDetailsExtraService from '../OrderDetailsExtraService'
import classnames from 'classnames'
import styles from './styles'

class OrderDetailsOptions extends React.Component {
  static defaultProps = {
    order: {
      data: {
        currentOrder: {
          options: {
            color: false,
            mailType: 'USPS_FIRST_CLASS',
            extraService: 'NONE',
            doubleSided: false
          }
        }
      }
    }
  }

  updateOptions = (mutate) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateOptions: {
        ...this.props.order.data.currentOrder.options,
        ...variables.input,
        __typename: 'Options'
      }
    },
    update: (store, { data: { updateOptions } }) => {
      const { currentOrder } = store.readQuery({ query: ORDER_QUERY })
      store.writeQuery({
        query: ORDER_QUERY,
        data: {
          currentOrder: {
            ...currentOrder,
            options: {
              ...currentOrder.options,
              ...updateOptions
            }
          }
        }
      })
    }
  })

  handleAlignment = (mutate) => (evt, alignment) => mutate({
    variables: {
      input: {
        id: this.props.order.data.currentOrder.options.id,
        extraService: alignment
      }
    }
  })

  render () {
    const {
      order
    } = this.props

    const { classes, ...rest } = this.props
    const currentOrder = order?.data?.currentOrder
    const color = currentOrder?.options?.color
    const doubleSided = currentOrder?.options?.doubleSided
    const uspsFirstClass = currentOrder?.options?.mailType === 'USPS_FIRST_CLASS'
    const extraService = currentOrder?.options?.extraService
    return (
      <Mutation mutation={UPDATE_OPTIONS}>
        {(mutate, { error, data, loading }) => {
          return (
            <React.Fragment>
              <div className={classes.row}>
                <div className={classes.item}>
                  <List subheader={<ListSubheader>Options</ListSubheader>}>
                    <ListItem>
                      <ListItemIcon>
                        <InvertColors />
                      </ListItemIcon>
                      <ListItemText primary='Print in color' />
                      <ListItemSecondaryAction>
                        <OrderDetailsToggle
                          checked={color}
                          label={'Print in color'}
                          name='color'
                          updateOptions={this.updateOptions(mutate)}
                          order={currentOrder}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Print />
                      </ListItemIcon>
                      <ListItemText primary='Double-sided?' />
                      <ListItemSecondaryAction>
                        <OrderDetailsToggle
                          checked={doubleSided}
                          label={'Double-sided?'}
                          name='doubleSided'
                          updateOptions={this.updateOptions(mutate)}
                          order={currentOrder}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <MailIcon />
                      </ListItemIcon>
                      <ListItemText primary='USPS First Class' />
                      <ListItemSecondaryAction>
                        <OrderDetailsToggle
                          checked={uspsFirstClass}
                          label={'USPS First Class?'}
                          name='mailType'
                          updateOptions={this.updateOptions(mutate)}
                          order={currentOrder}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </div>
                <div className={classnames(classes.item, classes.right)}>
                  <OrderDetailsExtraService
                    alignment={extraService}
                    handleAlignment={this.handleAlignment(mutate)}
                    order={currentOrder}
                  />
                </div>
              </div>
            </React.Fragment>
          )
        }}
      </Mutation>
    )
  }
}

OrderDetailsOptions.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.object
}

export default withStyles(styles)(OrderDetailsOptions)
