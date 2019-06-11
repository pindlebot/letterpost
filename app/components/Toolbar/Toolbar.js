import React from 'react'
import styles from './styles.scss'

class Toolbar extends React.Component {
  render () {
    return (
      <div className={styles.toolbar}>
        {this.props.children}
      </div>
    )
  }
}

export default Toolbar
