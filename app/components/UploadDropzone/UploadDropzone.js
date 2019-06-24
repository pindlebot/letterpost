import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import 'isomorphic-fetch'
import Button from 'antd/lib/button'
import styles from './styles'
import SupportedUploadFormats from '../SupportedUploadFormats'

class UploadDropzone extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.paper}>
        <SupportedUploadFormats classes={classes} />
        <Button onClick={this.props.handleClick}>Upload Documents</Button>
      </div>
    )
  }
}

export default withStyles(styles)(UploadDropzone)
