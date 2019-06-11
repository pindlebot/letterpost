import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import styles from './styles.scss'

const OrderStepHeading = ({ step, label }) => (
  <div className={styles.inline}>
    <Avatar className={styles.avatar}>{step}</Avatar>
    <div style={{ color: '#fff' }}>{label}</div>
  </div>
)

export default OrderStepHeading
