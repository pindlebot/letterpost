import React from 'react'
import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import EmailIcon from '@material-ui/icons/Email'
import AttachmentIcon from '@material-ui/icons/Attachment'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import classnames from 'classnames'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import EVENT_TYPES from '../../lib/eventTypes'
import classes from './styles.scss'

const STEPS = [
  'Processing',
  'Processed for delivery',
  'In transit',
  'Delivered'
]

const formatDate = (dateString) => {
  return dateString.slice(0, 10).split('-').reverse().join('/')
}

class OrderCard extends React.Component {
  render () {
    const { order } = this.props
    const { upload } = order
    if (!(order.upload && order.charge && order.paid && order.letter)) {
      return false
    }
    let { letter } = order
    let events = order.events || []
    let event = EVENT_TYPES['letter.created']
    return (
      <Card className={classes.card}>
        <div className={classnames(classes.row, classes.header)}>
          <div className={classes.detail}>
            <div className={classes.uppercase}>Order Placed</div>
            <div>{formatDate(letter.createdAt)}</div>
          </div>
          <div className={classes.detail}>
            <div className={classes.uppercase}>Total</div>
            <div>${(order.charge.amount / 100).toFixed(2)}</div>
          </div>
          <div className={classes.detail}>
            <div className={classes.uppercase}>Ship to</div>
            <div>{order.contact.address.name}</div>
          </div>
          <div className={classes.detail}>
            <div className={classes.uppercase}>Order ID</div>
            <div>{order.id}</div>
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.thumbnail}>
            <CardMedia image={upload.thumbnail} className={classes.media} />
          </div>
          <CardContent className={classes.content}>
            <div className={classes.inline}>
              <div className={classes.label}>File</div>
              <AttachmentIcon className={classes.icon} />
              <div>{upload.name}</div>
            </div>
            <div className={classes.inline}>
              <div className={classes.label}>ETA</div>
              <LocalShippingIcon className={classes.icon} />
              <div>{letter.expectedDeliveryDate}</div>
            </div>
            <div className={classes.inline}>
              <div className={classes.label}>Tracking</div>
              <EmailIcon className={classes.icon} />
              <div>{letter.trackingNumber || 'pending'}</div>
            </div>
          </CardContent>
          <Stepper activeStep={event.step} orientation={'vertical'}>
            {STEPS.map(step => (
              <Step key={step}>
                <StepLabel key={`${step}-label`}>
                  {step}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </Card>
    )
  }
}

export default OrderCard

