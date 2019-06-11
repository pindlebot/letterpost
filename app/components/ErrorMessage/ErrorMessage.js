import React from 'react'
import Icon from 'antd/lib/icon'
import styles from './styles.scss'

const ErrorMessage = props => {
  if (!(props.error && props.error.message)) return false
  if (!props.show) return false
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <Icon type="warning" />
        <div className={styles.type}>
          {props.error.message}
        </div>
        <Button onClick={props.handleClose} shape={'circle'} icon={'trash'} />
      </div>
    </div>
  )
}

ErrorMessage.defaultProps = {
  show: true,
  error: {}
}

export default ErrorMessage
