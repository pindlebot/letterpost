import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import IconButton from '@material-ui/core/IconButton'
import texture from '../../static/texture.png'
import shadow from '../../static/shadow.png'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import PdfEmbed from '../PdfEmbed'

class PdfEmbedDialog extends React.Component {
  state = {
    page: 1
  }

  increment = () => {
    this.setState(prevState => {
      return { page: prevState.page + 1 }
    })
  }

  decrement = () => {
    this.setState(prevState => {
      return { page: Math.max(1, prevState.page - 1) }
    })
  }

  render () {
    const { order: { data: { currentOrder } } } = this.props
    if (!(currentOrder && currentOrder.upload)) return false
    const { upload: { file, pages } } = currentOrder
    const { classes } = this.props
    return (
      <Dialog
        open={this.props.open}
        PaperProps={{
          style: {
            height: '90vh',
            width: '90vw',
            backgroundColor: '#404040',
            backgroundImage: `url("${texture}")`
          }
        }}
      >
        <div className={classes.header}>
          <div>
            <IconButton onClick={this.decrement}>
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton onClick={this.increment}>
              <KeyboardArrowRight />
            </IconButton>
          </div>
          <div>
            {this.state.page + ' / ' + pages}
          </div>
        </div>
        <DialogContent className={classes.content}>
          <div className={classes.canvas}>
            <PdfEmbed
              url={file}
              open={this.props.open}
              page={this.state.page}
            />
          </div>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={this.props.handleClose}>Cancel</Button>
          <Button onClick={this.props.submitOrder}>Submit Order</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

PdfEmbedDialog.defaultProps = {
  open: false,
  order: {
    data: {
      currentOrder: {}
    }
  }
}

const styles = {
  title: {
    padding: 0,
    color: '#fff'
  },
  actions: {
    padding: '8px 16px'
  },
  content: {
    padding: '0 16px 8px 16px'
  },
  header: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    color: '#fff',
    paddingRight: '16px',
    boxSizing: 'border-box'
  },
  canvas: {
    width: `${612 * 2}`,
    height: `${792 * 2}`,
    margin: '0 auto -8px auto',
    borderLeft: '9px solid transparent',
    borderRight: '9px solid transparent',
    borderBottom: '9px solid transparent',
    backgroundClip: 'content-box',
    borderImage: `url("${shadow}") 9 9 repeat`,
    backgroundColor: 'white'
  }
}

export default withStyles(styles)(PdfEmbedDialog)
