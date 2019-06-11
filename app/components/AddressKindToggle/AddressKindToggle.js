import React from 'react'

import Radio from 'antd/lib/radio'
import classes from './styles.scss'

const KIND = {
  RECIPIENT: 'RECIPIENT',
  SENDER: 'SENDER'
}

class AddressKindToggle extends React.Component {
  render () {
    return (
      <Radio.Group
        value={this.props.kind}
        onChange={this.props.handleAlignment}
        className={classes.toggleButtonGroup}
      >
        <Radio.Button
          value={KIND.RECIPIENT}
          className={classes.toggleButton}
        >
          <span>Recipient</span>
        </Radio.Button>
        <Radio.Button
          value={KIND.SENDER}
          className={classes.toggleButton}
        >
          <span>Sender</span>
        </Radio.Button>
      </Radio.Group>
    )
  }
}

export default AddressKindToggle
