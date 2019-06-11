import React from 'react'
import PropTypes from 'prop-types'
import Radio from 'antd/lib/radio'
import styles from './styles.scss'

const EXTRA_SERVICE = [
  'NONE',
  'CERTIFIED',
  'REGISTERED'
]

class OrderDetailsExtraService extends React.Component {
  static defaultProps = {
    alignment: 'NONE'
  }

  static propTypes = {
    alignment: PropTypes.string,
    handleAlignment: PropTypes.func.isRequired,
    order: PropTypes.object
  }

  isDisabled = (service) => {
    return service !== 'NONE' && this.props.order?.options?.mailType === 'USPS_STANDARD'
  }

  render () {
    return (
      <div className={styles.root}>
        <div className={styles.mailType}>Mail Type</div>
        <Radio.Group
          buttonStyle="solid"
          value={this.props.alignment || 'NONE'}
          onChange={this.props.handleAlignment}
        >
          {EXTRA_SERVICE.map(service => (
            <Radio.Button value={service} disabled={this.isDisabled(service)} key={service} className={styles.button}>
              {service}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
    )
  }
}

export default OrderDetailsExtraService
