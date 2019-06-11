import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import List from 'antd/lib/List'
// import Button from '@material-ui/core/Button'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AttachmentIcon from '@material-ui/icons/Attachment'
import OrderStepHeading from 'OrderStepHeading'
import OrderCard from 'OrderCard'
import PersonIcon from '@material-ui/icons/Person'
import LinearProgress from '@material-ui/core/LinearProgress'
import PaymentMethods from 'PaymentMethods'
import Checkbox from 'antd/lib/checkbox'
import EditEmailTextField from 'EditEmailTextField'
import { Mutation } from 'react-apollo'
import Quote from 'Quote'
import OrderDetailsOptions from 'OrderDetailsOptions'
import {
  UPDATE_USER
} from '../../graphql/mutations'
import Button from 'antd/lib/button'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import styles from './styles.scss'

class EditEmailTextFieldWithMutations extends React.Component {
  updateUser = mutate => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateUser: {
        ...variables.input,
        __typename: 'User'
      }
    }
  })

  render () {
    return (
      <Mutation mutation={UPDATE_USER}>
        {(mutate, { error, data, loading }) => (
          <EditEmailTextField
            {...this.props}
            updateUser={this.updateUser(mutate)}
          />)
        }
      </Mutation>
    )
  }
}

class OrderGrid extends React.Component {
  static propTypes = {
    order: PropTypes.shape({
      data: PropTypes.shape({
        currentOrder: PropTypes.shape({
          upload: PropTypes.shape({
            name: PropTypes.string
          }),
          contact: PropTypes.shape({
            address: PropTypes.shape({
              name: PropTypes.string
            })
          })
        })
      })
    })
  }

  render () {
    const {
      order,
      pending,
      complete,
      error
    } = this.props
    const currentOrder = order?.data?.currentOrder
    const user = this.props.user?.data?.user
    let upload = currentOrder?.upload
    let contact = currentOrder?.contact
    let letter = currentOrder?.letter
    return (
      <div className={styles.root}>
        <Row className={classnames(styles.grid, error.upload ? styles.error : '')}>
          <Col span={12} className={styles.left}>
            {upload ? (
              <div className={styles.listItem}>
                <div className={styles.listItemIcon}><AttachmentIcon /></div>
                <div>{upload?.name || ''}</div>
              </div>
            ) : (
              <OrderStepHeading step={1} label={'Add a document'} />
            )}
          </Col>
          <Col span={12} className={styles.right}>
            <Button
              onClick={() => this.props.handleOpen('dropzone')}
              disabled={complete || pending}
              type={'primary'}
            >
              Upload Documents
            </Button>
          </Col>
        </Row>
        <Row className={classnames(styles.grid, error.contact ? styles.error : '')}>
          <Col span={12} className={styles.left}>
            {contact?.address?.name ? (
              <div className={styles.listItem}>
                <div className={styles.listItemIcon}><PersonIcon /></div>
                <div>{contact?.address?.name}</div>
              </div>
            ) : (<OrderStepHeading step={2} label={'Add a shipping address'} />
            )}
          </Col>
          <Col span={12} className={styles.right}>
            <Button
              onClick={() => this.props.handleOpen('addressbook')}
              disabled={complete || pending}
              type={'primary'}
            >
              Add Recipient
            </Button>
          </Col>
        </Row>
        <Row className={classnames(styles.grid, error.card ? styles.error : '')}>
          <Col span={12} className={styles.left}>
            {user?.cards?.length
              ? (<PaymentMethods {...this.props} />)
              : (<OrderStepHeading step={3} label={'Add a payment method'} />)}
          </Col>
          <Col span={12} className={styles.right}>
            <Button
              // variant={'contained'}
              // color={'primary'}
              onClick={() => this.props.handleOpen('stripe')}
              disabled={complete || pending}
              type={'primary'}
            >Add Card</Button>
          </Col>
        </Row>
        <Row className={classnames(styles.grid, error.card ? styles.error : '')}>
          <Col span={12} className={styles.left}>
            <OrderStepHeading step={4} label={'Add an email address'} />
          </Col>
          <Col span={12} className={styles.right}>
            <EditEmailTextFieldWithMutations {...this.props} />
          </Col>
        </Row>
        <Row className={styles.grid}>
          <Col span={24}>
            <OrderDetailsOptions {...this.props} />
          </Col>
        </Row>
        <Row className={styles.grid}>
          {pending && <LinearProgress color={'primary'} />}
          <Col span={12} className={styles.left}>
            <Checkbox
              value={this.props.accept}
              onChange={this.props.onCheckboxChange}
            >
              <span className={styles.checkboxTerms}>I accept the <a href='/terms'>terms and conditions</a></span>
            </Checkbox>
          </Col>
          <Col span={12} className={styles.right}>
            <Quote
              currentOrder={currentOrder}
              styles={styles}
            />
            <Button
              onClick={this.props.preSubmit}
              disabled={complete || pending}
              type={'primary'}
            >
            Review & Submit
            </Button>
          </Col>
        </Row>
        {letter && <OrderCard order={currentOrder} />}
      </div>
    )
  }
}

export default OrderGrid
