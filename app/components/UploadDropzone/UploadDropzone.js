import React from 'react'
import Paper from '@material-ui/core/Paper'
import withStyles from '@material-ui/core/styles/withStyles'
import 'isomorphic-fetch'
import Button from '@material-ui/core/Button'
import styles from './styles'
import SupportedUploadFormats from '../SupportedUploadFormats'

class UploadDropzone extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <Paper className={classes.paper} elevation={0}>
        <SupportedUploadFormats classes={classes} />
        <Button onClick={this.props.handleClick}>Upload Documents</Button>
      </Paper>
    )
  }
}

export default withStyles(styles)(UploadDropzone)
