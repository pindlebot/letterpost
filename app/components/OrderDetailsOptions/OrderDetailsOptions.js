/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import OrderDetailsToggle from '../OrderDetailsToggle'
import InvertColors from '@material-ui/icons/InvertColors'
import Print from '@material-ui/icons/Print'
import { Mutation, Query } from 'react-apollo'
import { UPDATE_OPTIONS } from '../../graphql/mutations'
import { ORDER_OPTIONS_QUERY } from '../../graphql/queries'
import MailIcon from '@material-ui/icons/Mail'
import OrderDetailsExtraService from '../OrderDetailsExtraService'
import classnames from 'classnames'
import styles from './styles.scss'

import List from 'antd/lib/list'

const icons = {
  color: <InvertColors />,
  doubleSided: <Print />,
  mail: <MailIcon />
}

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

  handleAlignment = (mutate, data) => (evt) => {
    return mutate({
      variables: {
        input: {
          id: data?.currentOrder?.options?.id,
          extraService: evt.target.value
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
    const dataSource = [{
      title: 'Print in color',
      icon: icons.color,
      name: 'color',
      value: currentOrder?.options.color
    }, {
      title: 'Double-sided?',
      icon: icons.doubleSided,
      name: 'doubleSided',
      value: currentOrder?.options.doubleSided
    }, {
      title: 'USPS First Class?',
      icon: icons.mail,
      name: 'mailType',
      value: currentOrder?.options.mailType
    }]
   
    console.log(dataSource)
    return (
      <Mutation mutation={UPDATE_OPTIONS}>
        {(mutate, { error, data, loading }) => (
          <Query query={ORDER_OPTIONS_QUERY} variables={{ id: currentOrder?.id }} skip={!currentOrder?.id}>
            {({ data }) => (
              <React.Fragment>
                <div className={styles.row}>
                  <div className={styles.item}>
                    <List
                      title={'Options'}
                      dataSource={dataSource}
                      renderItem={({ title, icon, name, value }) => (
                        <List.Item className={styles.listItem}>
                          <List.Item.Meta
                            title={title}
                            className={styles.listItemMeta}
                          >
                          </List.Item.Meta>
                          <OrderDetailsToggle
                            checked={Boolean(data?.currentOrder?.options[name])}
                            label={title}
                            name={name}
                            updateOptions={this.updateOptions(mutate, data)}
                            options={data?.currentOrder?.options}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                  <div className={classnames(styles.item, styles.right)}>
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
  order: PropTypes.object
}

export default OrderDetailsOptions
