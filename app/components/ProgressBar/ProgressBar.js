import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'

const styles = {
  root: {
    width: '100%',
    marginTop: 30
  }
}

class ProgressBar extends React.Component {
  state = {
    completed: 0
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.loading) {
      this.progress(0)
    } else {
      this.resetProgress()
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
  }

  resetProgress () {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.setState({ completed: 0 }), 1000)
  }

  progress (completed) {
    completed += 10
    this.timer = setTimeout(() =>
      this.setState({ completed }, () => {
        if (completed <= 100 && completed > 0) {
          this.progress(this.state.completed)
        } else {
          this.resetProgress()
        }
      }), 50)
  }

  render () {
    const { completed } = this.state
    // if (completed === 0 || completed === 100) {
    //  return false
    // }
    return (<LinearProgress
      mode='determinate'
      value={this.state.completed}
    />)
  }
}

export default withStyles(styles)(ProgressBar)
