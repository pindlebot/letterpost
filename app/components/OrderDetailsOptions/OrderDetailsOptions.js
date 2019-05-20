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
import { Mutation, Query } from 'react-apollo'
import { UPDATE_OPTIONS } from '../../graphql/mutations'
import { ORDER_OPTIONS_QUERY } from '../../graphql/queries'
import MailIcon from '@material-ui/icons/Mail'
import OrderDetailsExtraService from '../OrderDetailsExtraService'
import classnames from 'classnames'
import styles from './styles'

class OrderDetailsOptions extends React.Component {
  static defaultProps = {}

  updateOptions = (mutate, data) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateOptions: {
        ...data?.currentOrder?.options,
        ...variables.input,
        __typename: 'Options'
      }
    },
    update: (store, { data: { updateOptions } }) => {
      const { currentOrder } = store.readQuery({
        query: ORDER_OPTIONS_QUERY,
        variables: { id: data.currentOrder.id }
      })
      store.writeQuery({
        query: ORDER_OPTIONS_QUERY,
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

  handleAlignment = (mutate, data) => (evt, alignment) => {
    console.log({ data })
    return mutate({
      variables: {
        input: {
          id: data?.currentOrder?.options?.id,
          extraService: alignment
        }
      }
    })
  }

  render () {
    const {
      order
    } = this.props

    const { classes, ...rest } = this.props
    const currentOrder = order?.data?.currentOrder
    return (
      <Mutation mutation={UPDATE_OPTIONS}>
        {(mutate, { error, data, loading }) => (
          <Query query={ORDER_OPTIONS_QUERY} variables={{ id: currentOrder?.id }} skip={!currentOrder?.id}>
            {({ data }) => (
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
                            checked={data?.currentOrder?.options?.color}
                            label={'Print in color'}
                            name='color'
                            updateOptions={this.updateOptions(mutate, data)}
                            options={data?.currentOrder?.options}
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
                            checked={data?.currentOrder?.options?.doubleSided}
                            label={'Double-sided?'}
                            name='doubleSided'
                            updateOptions={this.updateOptions(mutate, data)}
                            options={data?.currentOrder?.options}
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
                            checked={data?.currentOrder?.options?.mailType === 'USPS_FIRST_CLASS'}
                            label={'USPS First Class?'}
                            name='mailType'
                            updateOptions={this.updateOptions(mutate, data)}
                            options={data?.currentOrder?.options}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </div>
                  <div className={classnames(classes.item, classes.right)}>
                    <OrderDetailsExtraService
                      alignment={data?.currentOrder?.options?.extraService}
                      handleAlignment={this.handleAlignment(mutate, data)}
                      order={data}
                    />
                  </div>
                </div>
              </React.Fragment>
            )}
          </Query>
        )}
      </Mutation>
    )
  }
}

OrderDetailsOptions.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.object
}

export default withStyles(styles)(OrderDetailsOptions)
